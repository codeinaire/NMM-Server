import { DataSource } from 'apollo-datasource'

// DB Entities
import database from '../../db/'
import Recipe from '../../db/entities/Recipe'
import RecipeAttribution from '../../db/entities/RecipeAttribution';
import AttributionSocialMedia from '../../db/entities/AttributionSocialMedia'

// TYPES
import { RecipeInput } from '../types'

export default class RecipeAPI extends DataSource {
  database: any
  context: any
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
    const found = await this.database.getRepository(Recipe).find({
      relations: [
        'attribution',
        'attribution.attributionSocialMedia'
      ]
    })
    console.log('Lumpo recapio!!!!!', found[2].attribution);
    return found;
  }

  public async createRecipe({ title, attribution, ingredients, method, hashtags, difficulty, cost, mealType, recipePhotos }: RecipeInput) {
    console.log('INSIDE DATA SOURCE', title);

    let recipe = new Recipe()
    recipe.title = title
    recipe.ingredients = ingredients
    recipe.method = method
    recipe.hashtags = hashtags
    recipe.difficulty = difficulty
    recipe.cost = cost
    recipe.mealType = mealType

    const recipePhotosArr = recipePhotos.map((recipe: any) => {
      let recipePhoto = new RecipePhoto()
      recipePhoto.height = recipe.height
      recipePhoto.width = recipe.width
      recipePhoto.url = recipe.url
      recipePhoto.type = recipe.type
      return recipePhoto
    })
    recipe.photos = recipePhotosArr

    let recipeAttribution = new RecipeAttribution()
    recipeAttribution.name = attribution.name
    recipeAttribution.email = attribution.email
    recipeAttribution.website = attribution.website


    let attributionSocial = new AttributionSocialMedia()
    attributionSocial.facebook = attribution.socialMedia.facebook || ""

    recipeAttribution.attributionSocialMedia = attributionSocial

    const savedAttribution = await this.database.getRepository(RecipeAttribution).save(recipeAttribution)
    recipe.attribution = savedAttribution
    const saved = await this.database.getRepository(Recipe).save(recipe)

    console.log('Recipe saved', saved);
    return saved
  }
}