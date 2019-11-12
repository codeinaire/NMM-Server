import "reflect-metadata"
import { ApolloServer } from 'apollo-server-lambda'

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

// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda'


// SERVER stuff
const dataSources = () => ({
  recipeAPI: new RecipeAPI()
})

const context = ({ event } : { event: APIGatewayProxyEvent }) => {
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