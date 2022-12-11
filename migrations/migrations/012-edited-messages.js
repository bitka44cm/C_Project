'use strict';

const { withTransaction } = require('../utils');

const TABLE_NAME = 'Messages';
const DB_SCHEMA = process.env.DB_SCHEMA;
const target = { tableName: TABLE_NAME, schema: DB_SCHEMA };

module.exports = {
  up: withTransaction(async (queryInterface, DataTypes, transaction) => {
    await queryInterface.addColumn(
      target,
      'isAction',
      {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      { transaction },
    );
  }),
  down: withTransaction(async (queryInterface, DataTypes, transaction) => {
    await queryInterface.removeColumn(target, 'isAction', { transaction });
  }),
};
