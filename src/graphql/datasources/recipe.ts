// DB Entities
import database from '../../db/'
import RecipeEntity from '../../db/entities/Recipe'
import RecipeAttributionEntity from '../../db/entities/RecipeAttribution';
import AttributionSocialMediaEntity from '../../db/entities/AttributionSocialMedia'

// TYPES
import { RecipeInput } from '../types';
import { RecipeApiClass } from '../custom.types';

export default class RecipeAPI extends RecipeApiClass {
  public constructor() {
    super()
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets   called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: any) {
    this.context = config.context
    this.database = await database()
  }

  public async findAllRecipes() {
    // const recipes = getRepository(Recipe).find();
    console.log('Please soup for you!!', database)
    const found = await this.database.getRepository(RecipeEntity).find({
      relations: [
        'attribution',
        'attribution.attributionSocialMedia'
      ]
    })
    console.log('Lumpo recapio!!!!!', found)
    return found;
  }

  public async createRecipe({ title, attribution, ingredients, method, hashtags, difficulty, cost, mealType, recipePhotos }: RecipeInput) {
    console.log('CHECK HECK ECK YALL', title);

    let recipe = new RecipeEntity()
    recipe.title = title
    recipe.ingredients = ingredients
    recipe.method = method
    recipe.hashtags = hashtags
    recipe.difficulty = difficulty
    recipe.cost = cost
    recipe.mealType = mealType
    recipe.lowResolution = recipePhotos.lowResolution
    recipe.standardResolution = recipePhotos.standardResolution

    let recipeAttribution = new RecipeAttributionEntity()
    recipeAttribution.name = attribution.name
    recipeAttribution.email = attribution.email
    recipeAttribution.website = attribution.website

    let attributionSocial = new AttributionSocialMediaEntity()
    attributionSocial.facebook = attribution.socialMedia.facebook || ""

    recipeAttribution.attributionSocialMedia = attributionSocial
    const savedAttribution = await this.database.getRepository(RecipeAttributionEntity).save(recipeAttribution)

    recipe.attribution = savedAttribution
    const savedRecipe = await this.database.getRepository(RecipeEntity).save(recipe)

    console.log('Recipe saved', savedRecipe);
    return savedRecipe
  }
}