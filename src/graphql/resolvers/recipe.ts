// TYPES
import { RecipeInput, Recipe } from '../types'
import { IResolverContext } from '../../types'
import RecipeEntity from '../../db/entities/Recipe'
import { RecipeAttribution } from '../types'

export default {
  Query: {
    recipes: async (
      _: any,
      __: any,
      { dataSources, log }: IResolverContext
    ): Promise<Array<Recipe>> => {
      log.info('Finding all recipes')
      const recipes = await dataSources.recipeAPI.findAllRecipes()
      log.info('Found all recipes')
      return recipes
    },
    recipe: async (
      _: any,
      { recipeId }: { recipeId: number },
      { dataSources, log }: IResolverContext
    ): Promise<Recipe> => {
      log.info(`Finding all recipe no. ${recipeId}`)
      const recipe = await dataSources.recipeAPI.findRecipe(recipeId)
      log.info(`Found all recipe no. ${recipe.id}`)
      return recipe
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe: RecipeInput },
      { dataSources, log }: IResolverContext
    ): Promise<Recipe> => {
      log.info('Creating recipe')
      const createdRecipe = await dataSources.recipeAPI.createRecipe(recipe)
      log.info('Recipe created')
      return createdRecipe
    },
    deleteRecipe: async (
      _: any,
      title: string,
      { auth, dataSources, log }: IResolverContext
    ): Promise<Recipe> => {
      log.info('Creating recipe')
      const deletedRecipe = await dataSources.recipeAPI.deleteRecipe(title)
      log.info('Recipe created')
      return deletedRecipe
    }
  },
  Recipe: {
    recipeAttribution: async (
      { recipeAttributionId }: RecipeEntity,
      __: any,
      { dataSources, log }: IResolverContext
    ): Promise<RecipeAttribution> => {
      log.info('Finding recipe attributions.')
      const attributions = await dataSources.recipeAPI.findAttribution(
        recipeAttributionId
      )
      log.info('Attributions found.')
      return attributions
    }
  }
}
