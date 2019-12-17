import { Connection, ConnectionManager } from 'typeorm'
import { ApolloServer } from 'apollo-server-lambda'
import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import {
  RecipeInput,
  Recipe,
  UserProfile,
  UserProfileInput,
  RecipeAttribution
} from './graphql/types'
import { LambdaLog } from 'lambda-log'
import { JwksClient } from 'jwks-rsa'

export interface IEnvs {
  audience: string
  issuer: string
  jwsUri: string
  silentLogger: boolean
}
export interface IServer {
  getApolloInstance(): ApolloServer
}

export interface IDatabase {
  getDatabase(): Promise<Connection>
}

export interface ILogger {
  getLogger(): LambdaLog
  createContext(arg0?: APIGatewayProxyEvent, arg1?: Context): void
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
    arg1: Array<string>,
    arg3?: LambdaLog
  ): Promise<string>
}

export interface IModifiedObject {
  [name: string]: string
}

// DATASOURCES
export interface IRecipeAPI extends DataSource {
  findAttribution(arg0: number): Promise<RecipeAttribution | undefined>
  findAllRecipes(): Promise<Array<Recipe>>
  createRecipe(args: any): Promise<Recipe>
  deleteRecipe(arg0: string): Promise<Recipe>
}

export interface IUserProfileAPI extends DataSource {
  createUserProfile(arg0: UserProfileInput, arg1?: string): Promise<UserProfile>
  findUserProfile(arg0: string, arg1?: string): Promise<UserProfile | undefined>
  initialize(arg0?: DataSourceConfig<any>): void
  closeDbConnection(): void
}

export interface ICalculatePoints {
  calculate(
    arg0: IChallengeObject,
    arg1: string,
    arg2?: number
  ): number | string
}

interface IChallengeObject {
  [index: string]: any
}
