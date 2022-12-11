import { MessagesEntity, RoomsEntity, UserEntity, UserRoomEntity } from '../../db/entities';
import { createError } from '../../utils/errors';
import { getTransaction } from '../../utils/getTransaction';
import { UploadClient } from '@uploadcare/upload-client';
import moment from 'moment';
const { Op } = require('sequelize');

const EMPTY_STRING_LENGTH = 0;

const EMPTY_ARRAY_LENGTH = 0;

class ChatService {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private client = new UploadClient({ publicKey: process.env.UPLOADCARE_PUBLIC_KEY! });
  async userJoinToChat(options: { userId: string }): Promise<{ message: string } | void> {
    const { userId } = options;
    const result = await UserEntity.update(
      {
        isOnline: true,
      },
      { where: { id: userId } },
    );

    if (result) {
      return { message: 'User connection is updated successfully' };
    }
  }

  async userLeftFromChat(options: { userId: string }): Promise<{ message: string } | void> {
    const { userId } = options;
    const result = await UserEntity.update(
      {
        isOnline: false,
      },
      { where: { id: userId } },
    );

    if (result) {
      return { message: 'User connection is updated successfully' };
    }
  }

  async getChatMessages(options: { roomId: string; filter?: string }): Promise<RoomsEntity | void> {
    try {
      const { filter = '', roomId } = options;

      const filterString = filter.toLowerCase();

      const filterResult = {
        text: { [Op.iLike]: `%${filterString}%` },
      };

      const messagesResult = await RoomsEntity.findOne({
        where: { id: roomId },
        include: [
          {
            model: MessagesEntity,
            as: 'roomMessages',
            where: {
              ...(filter.length !== EMPTY_STRING_LENGTH ? filterResult : null),
            },
            through: { attributes: [] },
            order: [['createdAt', 'ASC']],
            include: [
              {
                model: UserEntity,
                as: 'sentAuthorMessage',
                attributes: ['id', 'name', 'surname', 'avatarImg', 'typeOfImage', 'color'],
              },
            ],
          },
        ],
      });

      if (!messagesResult) {
        throw new createError.UnprocessableEntity();
      }

      return messagesResult;
    } catch (err) {
      console.error(err);
    }
  }

  async sendPrivateMessage(options: {
    authorId: string;
    roomId: string;
    text: string;
  }): Promise<MessagesEntity[] | void> {
    const transaction = await getTransaction();

    try {
      const { authorId, roomId, text } = options;

      const sendPrivateMessageResult = await MessagesEntity.create(
        {
          authorId,
          roomId,
          text,
        },
        { transaction },
      );

      if (sendPrivateMessageResult) {
        const allMessages = MessagesEntity.findAll({
          where: {
            roomId: roomId,
          },
        });

        if (allMessages) {
          transaction.commit();
          return allMessages;
        }
      }
    } catch (err) {
      console.error(err);
      transaction.rollback();
      throw err;
    }
  }

  async deleteChatHistory(options: {
    roomId: string;
  }): Promise<{ message: string; allMessages: MessagesEntity[] } | void> {
    const { roomId } = options;

    const result = await MessagesEntity.destroy({
      where: {
        roomId: roomId,
      },
    });

    if (result) {
      const allMessages = await MessagesEntity.findAll({
        where: {
          roomId: roomId,
        },
      });
      return { message: 'Chat history was removed', allMessages };
    }
  }

  async readMessage(options: {
    newMessages: MessagesEntity[];
    roomId: string;
  }): Promise<{ message: string; allMessages: MessagesEntity[] } | void> {
    const { newMessages, roomId } = options;

    let result;

    if (newMessages && newMessages.length !== EMPTY_ARRAY_LENGTH) {
      for (const newMessage of newMessages) {
        result = await MessagesEntity.update(
          {
            isNew: false,
          },
          { where: { id: newMessage.id } },
        );
      }
    }

    if (result) {
      const allMessages = await MessagesEntity.findAll({
        where: {
          roomId: roomId,
        },
      });
      if (allMessages) {
        return { message: 'Message is updated successfully', allMessages };
      }
    }
  }

  async getNewMessages(options: {
    userId: string;
    roomId: string;
  }): Promise<MessagesEntity[] | void> {
    const { userId, roomId } = options;

    const newMessages = await MessagesEntity.findAll({
      where: {
        roomId: roomId,
        authorId: { [Op.ne]: userId },
        isNew: true,
      },
      raw: true,
      order: [['createdAt', 'DESC']],
    });

    if (newMessages) {
      return newMessages;
    }
  }

  async editMessage(options: {
    messageId: string;
    text: string;
    roomId: string;
  }): Promise<MessagesEntity[] | void> {
    const { messageId, text, roomId } = options;

    const message = await MessagesEntity.findByPk(messageId);

    if (!message) {
      throw new createError.UnprocessableEntity();
    }

    const result = await message.update({ isEdit: true, text });

    if (result) {
      const allMessages = await MessagesEntity.findAll({ where: { roomId: roomId } });

      if (allMessages) {
        return allMessages;
      }
    }
  }

  async createChatGroup(options: {
    userIds: string[];
    name: string;
    authorName: string;
    authorId: string;
  }): Promise<{ message: string; newGroup: RoomsEntity } | void> {
    const { userIds, name, authorName, authorId } = options;

    const CREATE_GROUP_MESSAGE = `${authorName} created this chat`;

    const transaction = await getTransaction();
    try {
      const createChatGroupResult = await RoomsEntity.create(
        {
          name,
          creatorId: authorId,
        },
        { transaction },
      );

      if (createChatGroupResult) {
        const createActionMessageResult = await MessagesEntity.create(
          {
            text: CREATE_GROUP_MESSAGE,
            isAction: true,
            roomId: createChatGroupResult.id,
            authorId,
          },
          { transaction },
        );

        if (createActionMessageResult) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const [_, userId] of userIds.entries()) {
            await UserRoomEntity.create(
              {
                userId: userId,
                roomId: createChatGroupResult.id,
              },
              { transaction },
            );
          }

          const chatGroupWithMessages = await RoomsEntity.findOne({
            where: { id: createChatGroupResult.id },
            include: [
              {
                model: MessagesEntity,
                as: 'roomMessages',
                through: { attributes: [] },
                order: [['createdAt', 'ASC']],
                include: [
                  {
                    model: UserEntity,
                    as: 'sentAuthorMessage',
                    attributes: ['id', 'name', 'surname', 'avatarImg', 'typeOfImage', 'color'],
                  },
                ],
              },
            ],
            transaction: transaction,
          });

          if (chatGroupWithMessages) {
            transaction.commit();
            return { message: 'Group created successfully', newGroup: chatGroupWithMessages };
          }
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async addUserToChatGroup(options: {
    newUserIds: string[];
    roomId: string;
    authorName: string;
    authorId: string;
  }): Promise<{
    message: string;
    newMessages: RoomsEntity;
  } | void> {
    const { newUserIds, roomId, authorName, authorId } = options;

    const transaction = await getTransaction();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, newUserId] of newUserIds.entries()) {
        const addedUser = await UserEntity.findOne({
          where: { id: newUserId },
          transaction: transaction,
        });

        if (addedUser) {
          const addedUserFullName = `${addedUser.name} ${addedUser.surname}`;

          await UserRoomEntity.create(
            {
              userId: newUserId,
              roomId: roomId,
            },
            { transaction },
          );

          const ADD_USER_TO_CHAT_MESSAGE = `${authorName} added ${addedUserFullName} to this chat`;

          await MessagesEntity.create(
            {
              text: ADD_USER_TO_CHAT_MESSAGE,
              isAction: true,
              roomId: roomId,
              authorId,
            },
            { transaction },
          );
        }
      }

      const newMessages = await RoomsEntity.findOne({
        where: { id: roomId },
        include: [
          {
            model: MessagesEntity,
            as: 'roomMessages',
            through: { attributes: [] },
            order: [['createdAt', 'ASC']],
            include: [
              {
                model: UserEntity,
                as: 'sentAuthorMessage',
                attributes: ['id', 'name', 'surname', 'avatarImg', 'typeOfImage', 'color'],
              },
            ],
          },
        ],
        transaction: transaction,
      });

      if (newMessages) {
        transaction.commit();
        return {
          message: 'Group member added successfully',
          newMessages,
        };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async removeUserFromChatGroup(options: {
    userId: string;
    roomId: string;
    authorId: string;
  }): Promise<{
    message: string;
    newMessages: RoomsEntity;
  } | void> {
    const { userId, roomId, authorId } = options;

    const transaction = await getTransaction();
    try {
      const removedUser = await UserEntity.findOne({
        where: { id: userId },
        transaction: transaction,
      });
      if (removedUser) {
        const LEFT_CHAT_MESSAGE = `${removedUser.name} ${removedUser.surname} removed from this chat`;

        const result = await UserRoomEntity.destroy({
          where: { roomId, userId },
          transaction: transaction,
        });

        if (result) {
          const removeUserFromChatResult = await MessagesEntity.create(
            {
              text: LEFT_CHAT_MESSAGE,
              isAction: true,
              roomId: roomId,
              authorId,
            },
            { transaction },
          );

          const newMessages = await RoomsEntity.findOne({
            where: { id: roomId },
            include: [
              {
                model: MessagesEntity,
                as: 'roomMessages',
                through: { attributes: [] },
                order: [['createdAt', 'ASC']],
                include: [
                  {
                    model: UserEntity,
                    as: 'sentAuthorMessage',
                    attributes: ['id', 'name', 'surname', 'avatarImg', 'typeOfImage', 'color'],
                  },
                ],
              },
            ],
            transaction: transaction,
          });

          if (removeUserFromChatResult && newMessages) {
            transaction.commit();
            return {
              message: 'Group member removed successfully',
              newMessages,
            };
          }
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async removeChatGroup(options: { roomId: string }): Promise<{ message: string } | void> {
    const { roomId } = options;
    const transaction = await getTransaction();
    try {
      const result = await RoomsEntity.destroy({
        where: { id: roomId },
        transaction: transaction,
      });

      if (result) {
        const removeGroupResult = await UserRoomEntity.destroy({
          where: { roomId: roomId },
          transaction: transaction,
        });

        if (removeGroupResult) {
          transaction.commit();
          return { message: 'Chat group removed successfully' };
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async editChatGroupName(options: {
    roomId: string;
    newName: string;
  }): Promise<{ message: string; newName: string; roomId: string } | void> {
    const { roomId, newName } = options;
    const transaction = await getTransaction();
    try {
      const result = await RoomsEntity.update(
        {
          name: newName,
        },
        {
          where: { id: roomId },
          transaction: transaction,
        },
      );

      if (result) {
        transaction.commit();
        return { message: 'Chat group name edited successfully', newName, roomId };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async uploadChatGroupImg(options: {
    roomId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupImg: any;
  }): Promise<{ message: string; newGroupImg: string; roomId: string } | void> {
    const { roomId, groupImg } = options;
    const transaction = await getTransaction();
    try {
      const date = moment().format('DDMMYYYY-HHmmss_SSS');

      groupImg.originalname = `${date}-${groupImg.originalname}`;

      const { uuid } = await this.client.uploadFile(groupImg.buffer);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const downloadURL = `${process.env.UPLOADCARE_URL!}/${uuid}/`;

      const result = await RoomsEntity.update(
        { groupImg: downloadURL },
        {
          where: { id: roomId },
          returning: true,
        },
      );

      if (result) {
        transaction.commit();
        return {
          message: 'Chat group img edited successfully',
          newGroupImg: downloadURL,
          roomId,
        };
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async leaveFromChatGroup(options: { userId: string; roomId: string }): Promise<{
    message: string;
    roomId: string;
    userId: string;
    newMessages: RoomsEntity;
  } | void> {
    const { userId, roomId } = options;

    const transaction = await getTransaction();
    try {
      const removedUser = await UserEntity.findOne({
        where: { id: userId },
        transaction: transaction,
      });

      if (removedUser) {
        const LEFT_CHAT_MESSAGE = `${removedUser.name} ${removedUser.surname} has left this chat`;

        const result = await UserRoomEntity.destroy({
          where: { roomId, userId },
          transaction: transaction,
        });
        if (result) {
          const removeUserFromChatResult = await MessagesEntity.create(
            {
              text: LEFT_CHAT_MESSAGE,
              isAction: true,
              roomId: roomId,
              authorId: removedUser.id,
            },
            { transaction },
          );

          if (removeUserFromChatResult) {
            const newMessages = await RoomsEntity.findOne({
              where: { id: roomId },
              include: [
                {
                  model: MessagesEntity,
                  as: 'roomMessages',
                  through: { attributes: [] },
                  order: [['createdAt', 'ASC']],
                  include: [
                    {
                      model: UserEntity,
                      as: 'sentAuthorMessage',
                      attributes: ['id', 'name', 'surname', 'avatarImg', 'typeOfImage', 'color'],
                    },
                  ],
                },
              ],
              transaction: transaction,
            });

            if (newMessages) {
              transaction.commit();

              return { message: 'Group member removed successfully', roomId, userId, newMessages };
            }
          }
        }
      }
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }
}

export default new ChatService();
