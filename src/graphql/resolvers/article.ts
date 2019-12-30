export default {
  Query: {
    articles: async (
      _: any,
      __: any,
      { dataSources }: { dataSources: any }
    ) => {
      // console.log('This is query', dataSources);
      // console.log('DataSources', dataSources.articleAPI.context.event);
      const result = await dataSources.articleAPI.getArticles()
      return result
    }
  },
  Mutation: {
    createArticles: (
      _: any,
      { articles }: { articles: any },
      { dataSources }: { dataSources: any }
    ) => {
      console.log('RESOLVERS', dataSources)
      return dataSources.articleAPI.createArticles({ articles })
    },
    createArticle: (
      _: any,
      { article }: { article: any },
      { dataSources }: { dataSources: any }
    ) => {
      console.log('RESOLVERS@@@@@', dataSources, article)
      return dataSources.articleAPI.createArticle({ article })
    }
  }
}
