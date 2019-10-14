export default {
  Query: {
    recipes: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      console.log('This is query', dataSources.recipeAPI.context.auth);
      const authDetails = await dataSources.recipeAPI.context.auth.checkAuthAndResolve(dataSources.recipeAPI.context.event);
      console.log('AUTH DETAILS', authDetails);
      const result = await dataSources.recipeAPI.findAllRecipes();
      console.log('This is RESULT', result);
      return result;
    }
  }
}