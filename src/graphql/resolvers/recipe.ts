// TYPES
import { RecipeInput, Recipe } from '../types'
import { IResolverContext } from '../../types'

export default {
  Query: {
    recipes: async (
      _: any,
      __: any,
      {
        auth,
        dataSources,
        log
      } : IResolverContext
    ): Promise<Array<Recipe>> => {
      // TODO - add auth for recipe authors
      // log.info('Finding all recipes')
      const recipes = await dataSources.recipeAPI.findAllRecipes()
      // log.info('Found all recipes')
      return recipes
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe:RecipeInput },
      {
        auth,
        dataSources,
        log
      } : IResolverContext
    ): Promise<Recipe> => {
      console.log('recipe', recipe);

      log.info('Creating recipe')
      const createdRecipe = await dataSources.recipeAPI.createRecipe(recipe)
      log.info('Recipe created')
      return createdRecipe
    },
    deleteRecipe: async (
      _: any,
      title: string,
      {
        auth,
        dataSources,
        log
      } : IResolverContext
    ): Promise<Recipe> => {
      log.info('Creating recipe')
      const deletedRecipe = await dataSources.recipeAPI.deleteRecipe(title)
      log.info('Recipe created')
      return deletedRecipe
    },
  }
}
