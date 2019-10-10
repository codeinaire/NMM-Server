const {
  context: defaultContext,
  schema,
  RecipeAPI,
  ApolloServer,
  store
} = require('../');

/**
 * Integration testing utils
 */
export const constructTestServer = ({ context = defaultContext } = {}) => {
  const recipeAPI = new RecipeAPI({ store });
  console.log('UTILS RECIPE API', recipeAPI);


  const server = new ApolloServer({
    schema,
    dataSources: () => ({
      recipeAPI
    }),
    context
  });

  return { server, recipeAPI };
};

/**
 * e2e Testing Utils
 */

// refer to the apollo fullstack tute if I want to do e2e testing
