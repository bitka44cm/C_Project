import { Sequelize, Model, DataTypes } from 'sequelize';

export interface RolesAttributes {
  id: string;
  name: string;
}

export interface RolesCreationAttributes extends Omit<RolesAttributes, 'id'> {}

export class RolesEntity
  extends Model<RolesAttributes, RolesCreationAttributes>
  implements RolesAttributes
{
  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const init = (sequelize: Sequelize) => {
  RolesEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Roles',
      sequelize,
      schema: process.env.DB_SCHEMA,
    },
  );
};
