export default {
  Query: {
    me: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {

      const authDetails = await dataSources.recipeAPI.context.auth.checkScopesAndResolve(dataSources.recipeAPI.context.event, ['profile']);
      console.log('AUTH DETAILS', authDetails);
      const result = await dataSources.recipeAPI.findAllRecipes();
      return result;
    }
  },
  Mutation: {
    createProfile: async (_ : any, { id } : { id: string }, { dataSources } : { dataSources: any }) => {
      console.log('This is USER RESOLVER', dataSources, id);
      const result = await dataSources.userAPI.createUserProfile(id);
      console.log('This is RESULT', result);
      return result;
    }
  }
}