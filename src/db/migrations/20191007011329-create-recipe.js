'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thumbnail: {
        allowNull: false,
        type: Sequelize.JSON
      },
      lowResolution: {
        allowNull: false,
        type: Sequelize.JSON
      },
      standardResolution: {
        allowNull: false,
        type: Sequelize.JSON
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      attribution: {
        allowNull: false,
        type: Sequelize.JSON
      },
      ingredients: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      method: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      hashtags: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('recipes');
  }
};