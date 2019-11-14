// DI stuff
import { myContainer } from './inversify.config'
import { TYPES } from './inversifyTypes'
import { IServer } from './server';

const server = myContainer.get<IServer>(TYPES.Server)

export const graphql = server.getApolloInstance().createHandler({
  cors: {
    origin: true,
    credentials: true
  }
});