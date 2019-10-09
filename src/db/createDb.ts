import { Sequelize, DataTypes } from 'sequelize';
import ArticleModel from './models/article';
import RecipeModel from './models/recipe';

export default () => {
  const sequelize = new Sequelize('no-meat-may', 'no-meat-may', 'aoeui12345', {
    host: 'localhost',
    dialect: 'postgres'
  });

  const articles = ArticleModel(sequelize, DataTypes);
  const recipes = RecipeModel(sequelize, DataTypes);

  // TODO - This is causing DB connection error in tests.
  // sequelize.sync({ force: false }).then(() => {
  //   console.log('Database & tables created');
  // })

  return {
    articles,
    recipes
  };
};

