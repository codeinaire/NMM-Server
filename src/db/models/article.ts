'use strict';
import { Model, Sequelize } from 'sequelize';
class Article extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public hashtag!: [string];
  public type!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  return Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hashtag: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'article'
  })
};