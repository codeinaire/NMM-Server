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
import { IRecipeAPI, IServer, ILogger, IAuthorisation, IUserProfileAPI } from './types';

@injectable()
export default class Server implements IServer {
  private apolloServer: ApolloServer
  private readonly _recipeAPI: IRecipeAPI
  private readonly _userProfileAPI: IUserProfileAPI
  private readonly _logger: ILogger
  private readonly _authorisation: IAuthorisation

  public constructor(
    @inject(TYPES.RecipeAPI) recipeAPI: IRecipeAPI,
    @inject(TYPES.UserProfileAPI) userProfileAPI: IUserProfileAPI,
    @inject(TYPES.Logger) Logger: ILogger,
    @inject(TYPES.Authorisation) Authorisation: IAuthorisation
  ) {
    this._recipeAPI = recipeAPI
    this._userProfileAPI = userProfileAPI
    this._logger = Logger
    this._authorisation = Authorisation
  }
  private initContext() {
    return ({ event, context }: { event: APIGatewayProxyEvent, context: Context }) => {
      this._logger.createContext(event, context)
      const log = this._logger.getLogger()
      console.log('process.env.SILENT_LOGGING in server', process.env.SILENT_LOGGING);


      return {
        event,
        log,
        auth: this._authorisation
      }
    }
  }

  private initDatasources() {
    return () => ({
      recipeAPI: this._recipeAPI,
      userProfileAPI: this._userProfileAPI
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