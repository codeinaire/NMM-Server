export default {
  Query: {
    recipes: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      const result = await dataSources.recipeAPI.findAllRecipes();
      console.log('This is RESULT', result);
      return result;
    }
  }
}