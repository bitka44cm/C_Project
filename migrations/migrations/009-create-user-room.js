'use strict';

const { withTransaction } = require('../utils');

const TABLE_NAME = 'UserRoom';
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
          allowNull: false,
        },
        roomId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      { transaction },
    );
  }),
  down: withTransaction((queryInterface, DataTypes, transaction) => {
    return queryInterface.dropTable(target);
  }),
};
