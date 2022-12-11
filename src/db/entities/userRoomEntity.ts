import { Sequelize, Model, DataTypes } from 'sequelize';

export interface UserRoomAttributes {
  id: number;
  roomId: string;
  userId: string;
}

export interface UserRoomCreationAttributes extends Omit<UserRoomAttributes, 'id'> {}

export class UserRoomEntity
  extends Model<UserRoomAttributes, UserRoomCreationAttributes>
  implements UserRoomAttributes
{
  id!: number;
  roomId!: string;
  userId!: string;
}

export const init = (sequelize: Sequelize) => {
  UserRoomEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'UserRole',
      sequelize,
      schema: process.env.DB_SCHEMA,
      timestamps: false,
    },
  );
};
