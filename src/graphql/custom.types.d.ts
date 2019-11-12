import { DataSource } from 'apollo-datasource'
import { RecipeInput, Recipe } from './types';

export abstract class RecipeApiClass extends DataSource {
  database: any
  context: any
  constructor()
  abstract initialize(config: any): Promise<void>
  abstract findAllRecipes(): Promise<Array<Recipe>>
  abstract createRecipe(arg0: RecipeInput): Promise<Recipe>
}