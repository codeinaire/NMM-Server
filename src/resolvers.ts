module.exports = {
  Query: {
    articles: async (_, __, { dataSources }) => {
      console.log('This is query', dataSources);
      console.log('DataSources', dataSources.articleAPI.context.event);
      const result = await dataSources.articleAPI.getArticles();
      return result;
    }
  },
  Mutation: {
    createArticles: (_, { articles }, { dataSources }) => {
      console.log('RESOLVERS', dataSources );
      return dataSources.articleAPI.createArticles({ articles })
    },
    createArticle: (_, { article }, { dataSources }) => {
      console.log('RESOLVERS@@@@@', dataSources, article );
      return dataSources.articleAPI.createArticle({ article })
    }
  }
}