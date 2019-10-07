'use strict';
import { Model, Sequelize } from 'sequelize';

class Recipe extends Model {
  public id!: number;
  public thumbnail!: string;
  public low_resolution!: string;
  public standard_resolution!: string;
  public title!: string;
  public attribution!: string;
  public ingredients!: string;
  public method!: string;
  public hashtag!: [string];

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  return Recipe.init({
    thumbnail: {
      type: DataTypes.JSON,
      allowNull: false
    },
    lowResolution: {
      type: DataTypes.JSON,
      allowNull: false
    },
    standardResolution: {
      type: DataTypes.JSON,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attribution: {
      type: DataTypes.JSON,
      allowNull: false
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    method: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hashtags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'recipe'
  });
};