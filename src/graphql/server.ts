import { ApolloServer } from 'apollo-server-lambda';
// graphql
import { ArticleAPI } from './datasources/article';
import { RecipeAPI } from './datasources/recipe';
import schema from './schema';
// types
import { IAPIGatewayProxyEvent } from '../types/lambda';

import createDatabase from '../db/createDb';
const store = createDatabase();


export default new ApolloServer({
  schema,
  dataSources: () => {
    return {
      articleAPI: new ArticleAPI({ store }),
      recipeAPI: new RecipeAPI({ store })
    }
  },
  context: ({ event } : { event: IAPIGatewayProxyEvent }) => ({
    headers: event.headers,
    event
  })
})