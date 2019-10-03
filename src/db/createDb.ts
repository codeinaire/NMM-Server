import { Sequelize, DataTypes } from 'sequelize';
import ArticleModel from './models/article';

export default () => {
  const sequelize = new Sequelize('no-meat-may', 'no-meat-may', 'aoeui12345', {
    host: 'localhost',
    dialect: 'postgres'
  });

  const articles = ArticleModel(sequelize, DataTypes);


  sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created');
  })

  return { articles };
};

