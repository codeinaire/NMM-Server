// TYPES
import { RecipeInput, Recipe } from '../types'
import { IRecipeAPI } from '../datasources/recipe'

// TODO - figure out why DataSources<IRecipeAPI> can't find any methods
// on the abstract class
export default {
  Query: {
    recipes: async (
      _: any,
      __: any,
      {
        dataSources: {
          recipeAPI,
          context: { log }
        }
      }: { dataSources: { recipeAPI: IRecipeAPI; context: any } }
    ): Promise<Array<Recipe>> => {
      log.info('Finding all recipes')
      const recipes = await recipeAPI.findAllRecipes()
      log.info('Found all recipes')
      return recipes
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe: RecipeInput },
      {
        dataSources: {
          recipeAPI,
          context: { log }
        }
      }: { dataSources: { recipeAPI: IRecipeAPI; context: any } }
    ): Promise<Recipe> => {
      log.info('Creating recipe')
      const createdRecipe = await recipeAPI.createRecipe(recipe)
      log.info('Recipe created')
      return createdRecipe
    }
  }
}
