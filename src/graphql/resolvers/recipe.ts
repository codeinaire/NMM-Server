// TYPES
import { RecipeInput, Recipe } from '../types';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import { RecipeApiClass } from '../custom.types';

export default {
  Query: {
    recipes: async (_ : any, __ : any, { dataSources } : { dataSources: any }) => {
      const result = await dataSources.recipeAPI.findAllRecipes();
      // console.log('This is RESULT', result);
      return result;
    }
  },
  Mutation: {
    createRecipe: async (_ : any, { recipe } :{ recipe: RecipeInput }, { dataSources } : { dataSources: DataSources<RecipeApiClass> }): Promise<Recipe> => {
      console.log('args in resolver', recipe);
      console.log('datasources in resolver', dataSources);
      console.log('recipeAPI in resolver', dataSources.recipeAPI);

      const result = await dataSources.recipeAPI.createRecipe(recipe)
      console.log(result)
      return result
    }
  }
}