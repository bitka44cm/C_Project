'use strict';

const { withTransaction } = require('../utils');

const TABLE_NAME = 'Messages';
const DB_SCHEMA = process.env.DB_SCHEMA;
const target = { tableName: TABLE_NAME, schema: DB_SCHEMA };

const MAX_MESSAGE_LENGTH = 3000;

module.exports = {
  up: withTransaction((queryInterface, DataTypes, transaction) => {
    return queryInterface.createTable(
      target,
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
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
          type: DataTypes.STRING(MAX_MESSAGE_LENGTH),
          allowNull: false,
        },
        isNew: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        isEdit: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
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
      },
      { transaction },
    );
  }),
  down: withTransaction((queryInterface, DataTypes, transaction) => {
    return queryInterface.dropTable(target);
  }),
};
