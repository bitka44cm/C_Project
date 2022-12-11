'use strict';

const { withTransaction } = require('../utils');

const TABLE_NAME = 'Tokens';
const DB_SCHEMA = process.env.DB_SCHEMA;
const target = { tableName: TABLE_NAME, schema: DB_SCHEMA };

const MAX_TOKEN_LENGTH = 5000;

module.exports = {
  up: withTransaction((queryInterface, DataTypes, transaction) => {
    return queryInterface.createTable(
      target,
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        refreshToken: {
          type: DataTypes.STRING(MAX_TOKEN_LENGTH),
        },
        userId: {
          type: DataTypes.UUID,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
      },
      { transaction },
    );
  }),
  down: withTransaction((queryInterface, DataTypes, transaction) => {
    return queryInterface.dropTable(target);
  }),
};
