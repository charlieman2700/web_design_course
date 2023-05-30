'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      homePhone: {
        allowNull: false,
        type: Sequelize.STRING(8)
      },
      workPhone: {
        allowNull: false,
        type: Sequelize.STRING(8)
      },
      homeAddress: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      workAddress: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Addresses')
  }
}
