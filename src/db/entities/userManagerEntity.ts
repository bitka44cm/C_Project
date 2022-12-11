import { Sequelize, Model, DataTypes } from 'sequelize';

export interface UserManagerAttributes {
  id: number;
  userId: string;
  managerId: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface UserManagerCreationAttributes extends Omit<UserManagerAttributes, 'id'> {}

export class UserManagerEntity
  extends Model<UserManagerAttributes, UserManagerCreationAttributes>
  implements UserManagerAttributes
{
  id!: number;
  userId!: string;
  managerId!: string;
  createdAt!: string;
  updatedAt!: string;
}

export const init = (sequelize: Sequelize) => {
  UserManagerEntity.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      managerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'UserManager',
      sequelize,
      schema: process.env.DB_SCHEMA,
    },
  );
};
