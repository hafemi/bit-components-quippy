'use strict';

/** @type {import('sequelize')} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('ticket_type', 'modalInformation', {
        type: Sequelize.DataTypes.JSON,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('ticket_type', 'modalInformation'),
    ]);
  },
};
