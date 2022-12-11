'use strict';

const { withTransaction } = require('../utils');

const TABLE_NAME = 'ChangePassword';
const DB_SCHEMA = process.env.DB_SCHEMA;
const target = { tableName: TABLE_NAME, schema: DB_SCHEMA };

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
        userId: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
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
