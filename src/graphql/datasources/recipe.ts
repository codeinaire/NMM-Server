import { injectable, inject } from 'inversify'
// DB Entities
import RecipeEntity from '../../db/entities/Recipe'
import RecipeAttributionEntity from '../../db/entities/RecipeAttribution'
import AttributionSocialMediaEntity from '../../db/entities/AttributionSocialMedia'
// TYPES
// import { RecipeInput } from '../types'
import { TYPES } from '../../inversifyTypes'
import { IRecipeAPI, IDatabase } from '../../types'
import { Connection } from 'typeorm'
import { DataSourceConfig } from 'apollo-datasource'

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
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
    this.db = await this.database.getDatabase()
  }

  public async deleteRecipe(title: string): Promise<any> {
    console.log('title', title)

    const recipeToDelete: any = await this.db
      .getRepository(RecipeEntity)
      .findOne(title)
    console.log('recipeToDelete', recipeToDelete)
    const what = await this.db
      .getRepository(RecipeEntity)
      .remove(recipeToDelete)
    console.log('what', what)
    return recipeToDelete
  }

  public async findAllRecipes() {
    console.log('this.context', this.context)

    const recipes = await this.db.getRepository(RecipeEntity).find({
      relations: ['attribution', 'attribution.attributionSocialMedia']
    })
    console.log('recipes', recipes[0])

    return recipes
  }

  public async createRecipe(args: any) {
    let recipe = new RecipeEntity()
    recipe.title = args.title
    recipe.ingredients = args.ingredients
    recipe.method = args.method
    recipe.hashtags = args.hashtags
    recipe.difficulty = args.difficulty
    recipe.cost = args.cost
    recipe.mealType = args.mealType
    recipe.lowResolution = args.lowResolution
    recipe.standardResolution = args.standardResolution

    // let recipeAttribution = new RecipeAttributionEntity()
    // recipeAttribution.name = name
    // recipeAttribution.email = email
    // recipeAttribution.website = website!

    // let attributionSocial = new AttributionSocialMediaEntity()
    // attributionSocial.facebook = facebook!
    // attributionSocial.instragram = instagram!
    // attributionSocial.twitter = twitter!

    // // recipeAttribution.attributionSocialMedia = attributionSocial
    // // const savedAttribution = await this.db
    // //   .getRepository(RecipeAttributionEntity)
    // //   .save(recipeAttribution)

    // recipe.recipeAttribution = recipeAttribution
    // // attributionSocial.recipeAttribution = recipeAttribution
    const savedRecipe = await this.db.getRepository(RecipeEntity).save(recipe)

    return savedRecipe
  }
}
