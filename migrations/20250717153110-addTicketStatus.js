'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ticket', 'status', {
      type: Sequelize.DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ticket', 'status');
  }
};
