export default {
  Query: {
    recipes: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      console.log('This is query', dataSources);
      const result = await dataSources.recipeAPI.findAllRecipes();
      return result;
    }
  }
}