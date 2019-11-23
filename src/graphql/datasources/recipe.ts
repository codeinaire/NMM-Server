import { injectable, inject } from "inversify"
// DB Entities
import RecipeEntity from '../../db/entities/Recipe'
import RecipeAttributionEntity from '../../db/entities/RecipeAttribution'
import AttributionSocialMediaEntity from '../../db/entities/AttributionSocialMedia'
// TYPES
import { RecipeInput } from '../types'
import { TYPES } from "../../inversifyTypes";
import { IRecipeAPI, IDatabase } from '../../types';
import { Connection } from "typeorm"

@injectable()
export default class RecipeAPI implements IRecipeAPI {
  private context: any
  private db: Connection
  @inject(TYPES.Database) private database: IDatabase
  public constructor() {
    // this.database = database
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets   called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: any) {
    this.context = config.context
    this.db = await this.database.getDatabase()
  }

  public async findAllRecipes() {
    console.log('this.context',this.context)

    const recipes = await this.db.getRepository(RecipeEntity).find({
      relations: ['attribution', 'attribution.attributionSocialMedia']
    })

    return recipes
  }

  public async createRecipe({
    title,
    name,
    email,
    website,
    facebook,
    instagram,
    twitter,
    ingredients,
    method,
    hashtags,
    difficulty,
    cost,
    mealType,
    lowResolution,
    standardResolution
  }: RecipeInput) {
    let recipe = new RecipeEntity()
    recipe.title = title
    recipe.ingredients = ingredients
    recipe.method = method
    recipe.hashtags = hashtags
    recipe.difficulty = difficulty
    recipe.cost = cost
    recipe.mealType = mealType
    recipe.lowResolution = lowResolution
    recipe.standardResolution = standardResolution

    let recipeAttribution = new RecipeAttributionEntity()
    recipeAttribution.name = name
    recipeAttribution.email = email
    recipeAttribution.website = website

    let attributionSocial = new AttributionSocialMediaEntity()
    attributionSocial.facebook = facebook || ''
    attributionSocial.instragram = instagram || ''
    attributionSocial.twitter = twitter || ''

    recipeAttribution.attributionSocialMedia = attributionSocial
    const savedAttribution = await this.db
      .getRepository(RecipeAttributionEntity)
      .save(recipeAttribution)

    recipe.attribution = savedAttribution
    const savedRecipe = await this.db
      .getRepository(RecipeEntity)
      .save(recipe)

    return savedRecipe
  }
}
