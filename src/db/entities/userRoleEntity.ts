import { Sequelize, Model, DataTypes } from 'sequelize';

export interface UserRoleAttributes {
  id: number;
  roleId: string;
  userId: string;
}

export interface UserRoleCreationAttributes extends Omit<UserRoleAttributes, 'id'> {}

export class UserRoleEntity
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  id!: number;
  roleId!: string;
  userId!: string;
}

export const init = (sequelize: Sequelize) => {
  UserRoleEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      roleId: {
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
