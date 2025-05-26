'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ticket_type', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
      uuid: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      guildID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      typeName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      roleID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      prefix: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      modalInformation: {
        type: Sequelize.DataTypes.JSON,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ticket_type');
  },
};