'use strict';
import { Model, Sequelize } from 'sequelize';

class User extends Model {
  public id!: string;
  public points!: number;
  public recipeRead: [number];

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  return User.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recipeRead: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'user'
  });
};