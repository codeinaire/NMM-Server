import { ApolloServer } from 'apollo-server-lambda';
// graphql
import { ArticleAPI } from './datasources/article';
import { RecipeAPI } from './datasources/recipe';
import schema from './schema';
// types
import { IAPIGatewayProxyEvent } from '../types/lambda';

import createDatabase from '../db/createDb';
const store = createDatabase();

const dataSources = () => ({
  articleAPI: new ArticleAPI({ store }),
  recipeAPI: new RecipeAPI({ store })
});

const context = ({ event } : { event: IAPIGatewayProxyEvent }) => ({
  headers: event.headers,
  event
});

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
  ApolloServer,
  store,
  server,
};