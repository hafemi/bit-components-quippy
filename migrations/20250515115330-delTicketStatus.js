'use strict';

/** @type {import('sequelize')} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('ticket', 'status'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('ticket', 'status', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      }),
    ]);
  },
};
