export default {
  Query: {
    recipes: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      console.log('This is query', dataSources);
      console.log('DataSources', dataSources.recipeAPI.context.event);
      const result = await dataSources.recipeAPI.getRecipes();
      return result;
    }
  }
}