import { ApolloServer } from 'apollo-server-lambda';
import { getConnection } from 'typeorm';
// GRAPHQL
import ArticleAPI from './datasources/article';
import RecipeAPI from './datasources/recipe';
import UserAPI from './datasources/user';
import schema from './schema';

// AUTH
import Auth from '../utils/auth';

// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda';

const store = getConnection();

console.log('DATABASE!!!', store);


const dataSources = () => ({
  articleAPI: new ArticleAPI({ store }),
  recipeAPI: new RecipeAPI({ store }),
  userAPI: new UserAPI({ store })
});

const context = ({ event } : { event: APIGatewayProxyEvent }) => {
  return {
    event,
    auth: new Auth()
  }
};

const server = new ApolloServer({
  schema,
  dataSources,
  context
})

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  schema,
  RecipeAPI,
  ArticleAPI,
  UserAPI,
  ApolloServer,
  store,
  server,
  Auth
};