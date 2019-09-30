const { ApolloServer } = require('apollo-server-lambda');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const ArticleAPI = require('./datasources/article');

const { createDatabase } = require('../db/createDb');
const store = createDatabase();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      articleAPI: new ArticleAPI({ store })
    }
  },
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  })
})

module.exports.graphql = server.createHandler({
  cors: {
    origin: true,
    credentials: true
  }
});

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log('Module disposed. '));
}