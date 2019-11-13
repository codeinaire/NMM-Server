import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'
import { Database }  from '../db'

// GRAPHQL
import RecipeAPI from './datasources/recipe'
import schema from './schema'

// AUTH
import { createCheckScopesAndResolve } from '../utils/auth'
const auth = createCheckScopesAndResolve({
  jwksUri: process.env.JWS_URI || '',
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.AUDIENCE || ''
})

import log from '../utils/logger'

// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda'

// SERVER stuff
const database = async () => {
  const database = new Database();

  const dbConn: any = await database.getConnection();
  return dbConn;
}

const dataSources = async () => ({
  recipeAPI: new RecipeAPI({ database: await database() })
})

const context = ({ event, context }: { event: APIGatewayProxyEvent, context: any }) => {
  console.log('CONTEXT', context, event);
  const logger = log(event.requestContext)
  logger.info('testing log')

  return {
    event,
    auth
  }
}

const server = new ApolloServer({
  schema,
  dataSources,
  context,
  introspection: true,
  playground: true
})

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  schema,
  RecipeAPI,
  ApolloServer,
  server,
  auth
}
