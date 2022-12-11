import { Sequelize, Model, DataTypes } from 'sequelize';

export interface RoomsAttributes {
  id: string;
  name?: string;
  groupImg?: string;
  creatorId?: string;
}

export interface RoomsCreationAttributes
  extends Omit<RoomsAttributes, 'id' | 'name' | 'groupImg' | 'creatorId'> {}

export class RoomsEntity
  extends Model<RoomsAttributes, RoomsCreationAttributes>
  implements RoomsAttributes
{
  id!: string;
  name!: string;
  groupImg!: string;
  creatorId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const init = (sequelize: Sequelize) => {
  RoomsEntity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      groupImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: 'Rooms',
      sequelize,
      schema: process.env.DB_SCHEMA,
    },
  );
};
