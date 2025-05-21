'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('server_config', {
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
      channelIds: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('server_config');
  },
};
