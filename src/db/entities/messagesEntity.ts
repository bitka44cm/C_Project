import { Sequelize, Model, DataTypes } from 'sequelize';

export interface MessageAttributes {
  id: string;
  authorId?: string;
  roomId?: string;
  text: string;
  isNew?: boolean;
  isEdit?: boolean;
  isAction?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface MessageCreationAttributes extends Omit<MessageAttributes, 'id'> {}

export class MessagesEntity
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  id!: string;
  authorId!: string;
  recipientId!: string;
  text!: string;
  isNew!: boolean;
  isEdit!: boolean;
  isAction!: boolean;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;
}

export const init = (sequelize: Sequelize) => {
  MessagesEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isNew: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isEdit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      isAction: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      tableName: 'Messages',
      sequelize,
      schema: process.env.DB_SCHEMA,
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
};
