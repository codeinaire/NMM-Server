import { injectable, inject } from 'inversify'
// DB Entities
import RecipeEntity from '../../db/entities/Recipe'
import RecipeAttributionEntity from '../../db/entities/RecipeAttribution'
import AttributionSocialMediaEntity from '../../db/entities/AttributionSocialMedia'
// TYPES
import { RecipeInput } from '../types'
import { TYPES } from '../../inversifyTypes'
import { IRecipeAPI, IDatabase } from '../../types'
import { Connection } from 'typeorm'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class RecipeAPI implements IRecipeAPI {
  // private context: any
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
  public async initialize(config: DataSourceConfig<any>) {
    // this.context = config.context
    this.db = await this.database.getDatabase()
  }

  public async findAttribution() {
    const attributions = await this.db.getRepository(RecipeAttributionEntity).findOne({
      relations: ['attributionSocialMedia']
    })

    return attributions
  }

  public async findAllRecipes() {
    const recipes = await this.db.getRepository(RecipeEntity).find()
    console.log('recipes', recipes);


    return recipes
  }

  public async createRecipe({
    title,
    ingredients,
    method,
    hashtags,
    difficulty,
    cost,
    mealType,
    lowResolution,
    standardResolution,
    name,
    email,
    website = 'Website information is not available.',
    facebook = 'Facebook profile not available',
    instagram = 'Instagram profile not available',
    twitter = 'Twitter profile not available'
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

    const foundChef = await this.db
      .getRepository(RecipeAttributionEntity)
      .findOne({
        where: { name },
        relations: ['attributionSocialMedia']
      })

    if (foundChef) {
      recipe.recipeAttribution = foundChef
    } else {
      let recipeAttribution = new RecipeAttributionEntity()
      recipeAttribution.name = name
      recipeAttribution.email = email
      recipeAttribution.website = website!

      let attributionSocialMedia = new AttributionSocialMediaEntity()
      attributionSocialMedia.facebook = facebook!
      attributionSocialMedia.instragram = instagram!
      attributionSocialMedia.twitter = twitter!

      recipeAttribution.attributionSocialMedia = attributionSocialMedia
      recipe.recipeAttribution = recipeAttribution
    }

    const savedRecipe = await this.db.getRepository(RecipeEntity).save(recipe)

    return savedRecipe
  }

  public async deleteRecipe(title: string): Promise<any> {
    const recipeToDelete: any = await this.db
      .getRepository(RecipeEntity)
      .findOne(title)

    const deletedRecipe = await this.db
      .getRepository(RecipeEntity)
      .remove(recipeToDelete)
    await this.db
      .getRepository(RecipeAttributionEntity)
      .remove(recipeToDelete.recipeAttribution)
    await this.db
      .getRepository(RecipeAttributionEntity)
      .remove(recipeToDelete.recipeAttribution.attributionSocialMedia)

    return deletedRecipe
  }
}
