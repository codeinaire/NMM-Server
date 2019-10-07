import { DataSource } from 'apollo-datasource';

export class RecipeAPI extends DataSource {
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

  public async getRecipes() {
    const recipes = await this.store.recipes.findAll({
      attributes: ['id', 'title', 'attribution', 'ingredients', 'method', 'hashtags', 'standardResolution'],
      raw: true
    })
    console.log('This is recipes!!!!!', recipes);
    return recipes;
  };
}