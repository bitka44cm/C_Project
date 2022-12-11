import { TokenEntity } from './tokensEntity';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { UserRoleEntity } from './userRoleEntity';

export interface UserAttributes {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatarImg?: string;
  status?: string;
  lastTimezone?: number;
  isOnline?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly deletedAt?: string;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'isOnline'> {}

export class UserEntity
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: string;
  name!: string;
  surname!: string;
  email!: string;
  password!: string;
  avatarImg!: string;
  status!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;
  lastTimezone!: number;
  isOnline!: boolean;
}

export const init = (sequelize: Sequelize) => {
  UserEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatarImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Pending',
      },
      lastTimezone: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null,
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'Users',
      sequelize,
      schema: process.env.DB_SCHEMA,
      paranoid: true,
      deletedAt: 'deletedAt',
      hooks: {
        afterDestroy: async (instance, opt) => {
          const token = await TokenEntity.findOne({ where: { userId: instance.id } });
          const role = await UserRoleEntity.findOne({ where: { userId: instance.id } });
          await token?.destroy();
          await role?.destroy();
        },
      },
    },
  );
};
