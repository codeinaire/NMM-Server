// TYPES
import { RecipeInput, Recipe } from '../types'
import { IResolverContext } from '../../types'

// TODO - figure out why context<IRecipeAPI> can't find any methods
// on the abstract class
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
      log.info('Finding all recipes')
      const recipes = await dataSources.recipeAPI.findAllRecipes()
      log.info('Found all recipes')
      return recipes
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe: RecipeInput },
      {
        auth,
        dataSources,
        log
      } : IResolverContext
    ): Promise<Recipe> => {
      log.info('Creating recipe')
      const createdRecipe = await dataSources.recipeAPI.createRecipe(recipe)
      log.info('Recipe created')
      return createdRecipe
    }
  }
}
