import { Connection, ConnectionManager } from 'typeorm'
import { ApolloServer } from 'apollo-server-lambda'
import { DataSource } from 'apollo-datasource'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { RecipeInput, Recipe } from './graphql/types'
import { LambdaLog } from 'lambda-log'
import { JwksClient } from 'jwks-rsa'

export interface IServer {
  getApolloInstance(): ApolloServer
}

export interface IDatabase {
  getDatabase(): Promise<Connection>
}

export interface ILogger {
  getLogger(): LambdaLog
  createContext(arg0: APIGatewayProxyEvent, arg1: Context): void
}

export interface IResolverContext {
  event: APIGatewayProxyEvent
  log: LambdaLog
  auth: IAuthorisation
  // TODO - fix the any type
  dataSources: any
}

// AUTHORISATION
export interface IVerifiedToken {
  iss: string
  sub: string
  aud: [string]
  iat: number
  exp: number
  azp: string
  scope: string
}

export interface IDecodedToken {
  header: {
    typ: string
    alg: string
    kid: string
  }
  payload: {
    iss: string
    sub: string
    aud: [string]
    iat: number
    exp: number
    azp: string
    scope: string
  }
  signature: string
}

export interface IScopeAndId {
  principleId: string
  scopes: Array<string>
}

export interface IAuthorisation {
  checkScopesAndResolve(
    arg0: APIGatewayProxyEvent,
    arg1: Array<string>
  ): Promise<boolean>
}

export interface IModifiedObject {
  [name: string]: string
}

// DATASOURCES
export interface IRecipeAPI extends DataSource {
  findAllRecipes(): Promise<Array<Recipe>>
  createRecipe(arg0: RecipeInput): Promise<Recipe>
}