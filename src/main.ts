import "reflect-metadata";
const { server } = require('./graphql/index');

export const graphql = server.createHandler({
  cors: {
    origin: true,
    credentials: true
  }
});