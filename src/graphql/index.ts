import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'

// DI stuff
import { myContainer } from '../inversify.config'
import { RecipeApiClass } from './datasources/recipe';
import { TYPES } from '../inversifyTypes'

// GRAPHQL
import schema from './schema'

// AUTH
// import { createCheckScopesAndResolve } from '../utils/Authorisation'
// const auth = createCheckScopesAndResolve({
//   jwksUri: process.env.JWS_URI || '',
//   issuer: process.env.TOKEN_ISSUER || '',
//   audience: process.env.AUDIENCE || ''
// })

import log from '../utils/logger'

// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda'

// SERVER stuff
const recipeAPI = myContainer.get<RecipeApiClass>(TYPES.RecipeAPI)

const dataSources = () => ({
  recipeAPI
})

const context = ({ event, context }: { event: APIGatewayProxyEvent, context: any }) => {
  console.log('CONTEXT', context, event);
  const logger = log(event.requestContext)
  logger.info('testing log')

  return {
    event,
    // auth
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
  recipeAPI,
  ApolloServer,
  server,
  // auth
}
