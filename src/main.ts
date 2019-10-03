import server from './graphql/server';

export const graphql = server.createHandler({
  cors: {
    origin: true,
    credentials: true
  }
});