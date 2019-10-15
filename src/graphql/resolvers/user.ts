export default {
  Query: {
    me: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      const verifiedId = await dataSources.recipeAPI.context.auth.checkScopesAndResolve(dataSources.recipeAPI.context.event, ['profile']);
      console.log('AUTH DETAILS', verifiedId);
      return await dataSources.userAPI.findOrCreateUserProfile(verifiedId);
    }
  },
  Mutation: {
    createProfile: async (_ : any, { id } : { id: string }, { dataSources } : { dataSources: any }) => {
      const verifiedId = await dataSources.recipeAPI.context.auth.checkScopesAndResolve(dataSources.recipeAPI.context.event, ['profile']);
      console.log('This is USER RESOLVER', dataSources, id);
      const result = await dataSources.userAPI.findOrCreateUserProfile(verifiedId);
      console.log('This is RESULT', result);
      return result;
    }
  }
}