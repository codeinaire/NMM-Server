import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'
// Dependency injection
import { injectable, inject } from "inversify"
import { TYPES } from './inversifyTypes'
// GRAPHQL
import schema from './graphql/schema'
// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda'

export interface IServer {
  getApolloInstance(): ApolloServer
}

@injectable()
export class Server implements IServer {
  private apolloServer: ApolloServer
  @inject(TYPES.RecipeAPI) private recipeAPI: any
  private initContext() {
    return ({ event, context }: { event: APIGatewayProxyEvent, context: any }) => {
      // console.log('CONTEXT', context, event);
      // const logger = log(event.requestContext)
      // logger.info('testing log')

      return {
        event,
        // auth
      }
    }
  }

  private initDatasources() {
    return () => ({
      recipeAPI: this.recipeAPI
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