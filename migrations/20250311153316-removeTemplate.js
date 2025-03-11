'use strict';

/** @type {import('sequelize')} */
module.exports = {
  async up(queryInterface) {
    return Promise.all([
      queryInterface.dropTable('template'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable('template', {
        uuid: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }),
    ]);
  }
};