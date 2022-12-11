import { Sequelize, Model, DataTypes } from 'sequelize';

export interface TokenAttributes {
  id: number;
  refreshToken: string;
  userId?: string;
}

export interface TokenCreationAttributes extends Omit<TokenAttributes, 'id'> {}

export class TokenEntity
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  id!: number;
  refreshToken!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
}

export const init = (sequelize: Sequelize) => {
  TokenEntity.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      refreshToken: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      tableName: 'Tokens',
      sequelize,
      schema: process.env.DB_SCHEMA,
      deletedAt: 'deletedAt',
      paranoid: true,
    },
  );
};
