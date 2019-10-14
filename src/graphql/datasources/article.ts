import { DataSource } from 'apollo-datasource';

export default class ArticleAPI extends DataSource {
  store: any
  context: any
  public constructor({ store } : { store: any }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public initialize(config: any) {
    this.context = config.context;
  }

  public async getArticles() {
    const articles = await this.store.articles.findAll({
      attributes: ['id', 'title', 'content', 'hashtag', 'type'],
      raw: true
    })
    // console.log('This is articles!!!!!', articles);
    return articles;
  };

  public async createArticles ({ articles } : { articles: any}) {
    // console.log('This is created articles', this.store);
    const created = await this.store.articles.bulkCreate(articles);
    // console.log('This is created articles', created);
    return created;
  };

  public async createArticle ({ article: { title, type, content, hashtag } } : { article: { title: string, type: string, content: Text, hashtag: [string]}}) {
    console.log('this is DATASOURCE$$$$$', title, type, content, hashtag);

    const createdArticle = await this.store.articles.findOrCreate({ where: {
      title, type, content, hashtag
    }});
    console.log('created ARTICLE', createdArticle);

    return createdArticle[0].dataValues;
  }
}