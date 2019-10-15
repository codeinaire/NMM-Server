import { Sequelize, DataTypes } from 'sequelize';
import ArticleModel from './models/article';
import RecipeModel from './models/recipe';
import UserModel from './models/user';

export default () => {
  // TODO - these need to be replace with the production values, and/or a way to change values from prod to dev with config ENV VARS!!!
  const sequelize = new Sequelize('no-meat-may', 'no-meat-may', 'aoeui12345', {
    host: 'localhost',
    dialect: 'postgres'
  });

  const articles = ArticleModel(sequelize, DataTypes);
  const recipes = RecipeModel(sequelize, DataTypes);
  const users = UserModel(sequelize, DataTypes)
  // TODO - This is causing DB connection error in tests.
  // sequelize.sync({ force: false }).then(() => {
  //   console.log('Database & tables created');
  // })

  return {
    articles,
    recipes,
    users
  };
};