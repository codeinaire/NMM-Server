// TYPES
import { RecipeInput, Recipe } from '../types'
// TODO - figure out why DataSources<IRecipeAPI> can't find any methods
// on the abstract class
export default {
  Query: {
    recipes: async (
      _: any,
      __: any,
      { dataSources }: { dataSources: any }
    ): Promise<Array<Recipe>> => {
      console.log('datasources', dataSources);

      const recipes = await dataSources.recipeAPI.findAllRecipes()
      return recipes
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe: RecipeInput },
      { dataSources }: { dataSources: any }
    ): Promise<Recipe> => {
      const savedRecipe = await dataSources.recipeAPI.createRecipe(recipe)
      return savedRecipe
    }
  }
}
