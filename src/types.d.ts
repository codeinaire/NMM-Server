import { Connection } from 'typeorm'
import { ApolloServer } from 'apollo-server-lambda'
import { DataSource } from 'apollo-datasource'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { RecipeInput, Recipe } from './graphql/types'

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

export interface IAuth {
  checkScopesAndResolve: (
    arg0: APIGatewayProxyEvent,
    arg1: Array<string>,
  ) => Promise<string>
}

export interface IModifiedObject {
  [name: string]: string
}

// SERVER
export interface IServer {
  getApolloInstance(): ApolloServer
}

// DATASOURCES
export interface IRecipeAPI extends DataSource {
  initialize(config: any): Promise<void>
  findAllRecipes(): Promise<Array<Recipe>>
  createRecipe(arg0: RecipeInput): Promise<Recipe>
}

// DB
export interface IDatabase {
  getDatabase(): Promise<Connection>
}

export interface ILogger {
  // N.B. Using type any b/c the library isn't typed and
  // I don't want to create a custom type for it
  getLogger(): any
  createContext(arg0: APIGatewayProxyEvent, arg1: Context):any
}

export interface IAuthorisation {
  checkScopesAndResolve(arg0: APIGatewayProxyEvent, arg1: Array<string>): Promise<boolean>
}