'use strict';

const DB_SCHEMA = process.env.DB_SCHEMA;

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // install postgres extension to use uuid
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    // create db schema
    return queryInterface.createSchema(DB_SCHEMA);
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropSchema(DB_SCHEMA);
  },
};
