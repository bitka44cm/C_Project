'use strict';

const { withTransaction } = require('../utils');

const TABLE_NAME = 'Rooms';
const DB_SCHEMA = process.env.DB_SCHEMA;
const target = { tableName: TABLE_NAME, schema: DB_SCHEMA };

module.exports = {
  up: withTransaction(async (queryInterface, DataTypes, transaction) => {
    await queryInterface.addColumn(
      target,
      'name',
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
      { transaction },
    );
    await queryInterface.addColumn(
      target,
      'deletedAt',
      { type: DataTypes.DATE, allowNull: true },
      { transaction },
    );
    await queryInterface.addColumn(
      target,
      'groupImg',
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
      { transaction },
    );
    await queryInterface.addColumn(
      target,
      'creatorId',
      {
        type: DataTypes.UUID,
        allowNull: true,
      },
      { transaction },
    );
  }),
  down: withTransaction(async (queryInterface, DataTypes, transaction) => {
    await queryInterface.removeColumn(target, 'name', { transaction });
    await queryInterface.removeColumn(target, 'deletedAt', { transaction });
    await queryInterface.removeColumn(target, 'groupImg', { transaction });
    await queryInterface.removeColumn(target, 'creatorId', { transaction });
  }),
};
