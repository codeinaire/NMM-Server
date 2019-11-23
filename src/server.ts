require('dotenv').config()
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'
// Dependency injection
import { injectable, inject } from "inversify"
import { TYPES } from './inversifyTypes'
// GRAPHQL
import schema from './graphql/schema'
// TYPES
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { IRecipeAPI, IServer, ILogger, IAuthorisation } from './types';

@injectable()
export class Server implements IServer {
  private apolloServer: ApolloServer
  private _recipeAPI: IRecipeAPI
  private _logger: ILogger
  private _authorisation: IAuthorisation

  public constructor(
    @inject(TYPES.RecipeAPI) recipeAPI: IRecipeAPI,
    @inject(TYPES.Logger) Logger: ILogger,
    @inject(TYPES.Authorisation) Authorisation: IAuthorisation
  ) {
    this._recipeAPI = recipeAPI
    this._logger = Logger
    this._authorisation = Authorisation
  }
  private initContext() {
    return ({ event, context }: { event: APIGatewayProxyEvent, context: Context }) => {
      this._logger.createContext(event, context)
      const log = this._logger.getLogger()


      return {
        event,
        log,
        auth: this._authorisation
      }
    }
  }

  private initDatasources() {
    return () => ({
      recipeAPI: this._recipeAPI
    })
  }

  private createApolloServer() {
    this.apolloServer = new ApolloServer({
      schema,
      dataSources: this.initDatasources(),
      context: this.initContext(),
      introspection: true,
      playground: true
    })
  }

  public getApolloInstance() {
    this.createApolloServer()
    return this.apolloServer
  }
}