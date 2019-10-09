export default {
  Query: {
    me: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      console.log('This is query', dataSources);
      const result = await dataSources.recipeAPI.findAllRecipes();
      console.log('This is RESULT', result);
      return result;
    }
  }
}