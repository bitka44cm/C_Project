import { Sequelize, Model, DataTypes } from 'sequelize';

export interface ChangePasswordAttributes {
  id: string;
  email?: string;
  userId: string;
  readonly createdAt?: Date;
}

export interface ChangePasswordCreationAttributes extends Omit<ChangePasswordAttributes, 'id'> {}

export class ChangePasswordEntity
  extends Model<ChangePasswordAttributes, ChangePasswordCreationAttributes>
  implements ChangePasswordAttributes
{
  id!: string;
  email!: string;
  userId!: string;
  createdAt!: Date;
}

export const init = (sequelize: Sequelize) => {
  ChangePasswordEntity.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'ChangePassword',
      sequelize,
      schema: process.env.DB_SCHEMA,
    },
  );
};
