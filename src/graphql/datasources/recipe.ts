import { DataSource } from 'apollo-datasource';
import database from '../../db/';
// import { getRepository } from 'typeorm';
import Recipe from '../../db/entities/Recipe';
export default class RecipeAPI extends DataSource {
  store: any
  context: any
  public constructor() {
    super();
    // this.store = store
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

  public async findAllRecipes() {
    // const recipes = getRepository(Recipe).find();
    console.log('hey', database)
    const recipes = await database();
    const found = await recipes.getRepository(Recipe).find({
      select: [
        'title',
        'method',
        'mealType',
        'difficulty',
        'hashtags',
        'ingredients',
        'cost',
        'id'
      ]
    })
    console.log('This is recipes!!!!!', recipes, found);
    return found;
  };
}