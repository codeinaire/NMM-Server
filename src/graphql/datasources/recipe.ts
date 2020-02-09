import { injectable, inject } from 'inversify'
// DB Entities
import RecipeEntity from '../../db/entities/Recipe'
import RecipeAttributionEntity from '../../db/entities/RecipeAttribution'
// TYPES
import { RecipeInput } from '../types'
import { IRecipeAPI, IDatabase } from '../../types'

import { DataSourceConfig } from 'apollo-datasource'
import { TYPES } from '../../inversifyTypes'

@injectable()
export default class RecipeAPI implements IRecipeAPI {
  private context: any
  private readonly database: IDatabase
  public constructor(@inject(TYPES.Database) database: IDatabase) {
    this.database = database
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  public async findRecipe(id: number) {
    const db = await this.database.getConnection()
    const recipe = await db.getRepository(RecipeEntity).findOne({ id })

    return recipe
  }

  public async findAttribution(recipeAttributionId: number) {
    const db = await this.database.getConnection()
    const attributions = await db
      .getRepository(RecipeAttributionEntity)
      .findOne({
        id: recipeAttributionId
      })

    return attributions
  }

  public async findAllRecipes() {
    const db = await this.database.getConnection()
    const recipes = await db.getRepository(RecipeEntity).find()

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
    const db = await this.database.getConnection()

    // TODO - add logic to prevent recipe with same name being created
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

    let foundChef
    foundChef = await db.getRepository(RecipeAttributionEntity).findOne({
      where: { name }
    })

    if (foundChef) recipe.recipeAttribution = foundChef
    else {
      let recipeAttribution = new RecipeAttributionEntity()
      recipeAttribution.name = name
      recipeAttribution.email = email
      recipeAttribution.website = website!
      recipeAttribution.facebook = facebook!
      recipeAttribution.instagram = instagram!
      recipeAttribution.twitter = twitter!

      recipe.recipeAttribution = recipeAttribution
    }

    const savedRecipe = await db.getRepository(RecipeEntity).save(recipe)

    return savedRecipe
  }

  public async deleteRecipe(title: string): Promise<any> {
    const db = await this.database.getConnection()
    const recipeToDelete: any = await db
      .getRepository(RecipeEntity)
      .findOne(title)

    const deletedRecipe = await db
      .getRepository(RecipeEntity)
      .remove(recipeToDelete)
    await db
      .getRepository(RecipeAttributionEntity)
      .remove(recipeToDelete.recipeAttribution)

    return deletedRecipe
  }
}
