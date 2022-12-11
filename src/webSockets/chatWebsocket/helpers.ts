import { SOCKET_EVENTS } from '../../constants';
import { RoomsEntity, UserEntity } from '../../db/entities';
import { BaseError } from '../../utils/errors';
import chatService from './service';

export const connectToChat = async (userId: string) => {
  await chatService.userJoinToChat({ userId });
  return;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendError = (err: BaseError, socket: any) => {
  const json = err.toJSON();
  socket.emit(SOCKET_EVENTS.ERROR_EVENT, {
    status: json.status,
    msg: json.response,
  });
};

export const getRoomUsersIds = async (roomId: string) => {
  const room = await RoomsEntity.findOne({
    where: {
      id: roomId,
    },
    include: {
      model: UserEntity,
      as: 'roomUsers',
      attributes: ['id'],
      through: { attributes: [] },
    },
  });

  if (room) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roomInfo = room.get({ plain: true }) as any;

    const roomUsersIds = roomInfo.roomUsers.map((user: UserEntity) => user.id);

    return roomUsersIds;
  }
};
