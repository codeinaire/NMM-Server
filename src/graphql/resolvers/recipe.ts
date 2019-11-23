// TYPES
import { RecipeInput, Recipe } from '../types'
// import { IRecipeAPI } from '../../types'

// TODO - figure out why DataSources<IRecipeAPI> can't find any methods
// on the abstract class
export default {
  Query: {
    recipes: async (
      _: any,
      __: any,
      {
        dataSources: {
          recipeAPI
        }
      }: { dataSources: { recipeAPI: any}}
    ): Promise<Array<Recipe>> => {
      console.log('dataSources', recipeAPI );

      recipeAPI.context.log.info('Finding all recipes')
      const recipes = await recipeAPI.findAllRecipes()
      recipeAPI.context.log.info('Found all recipes')
      return recipes
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe: RecipeInput },
      {
        dataSources: {
          recipeAPI
        }
      }: { dataSources: { recipeAPI: any}}
    ): Promise<Recipe> => {
      console.log('dataSources', recipe);

      recipeAPI.context.log.info('Creating recipe')
      const createdRecipe = await recipeAPI.createRecipe(recipe)
      recipeAPI.context.log.info('Recipe created')
      return createdRecipe
    }
  }
}
