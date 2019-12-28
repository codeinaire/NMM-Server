import { Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'

import Recipe from '../entities/Recipe'
import RecipeAttribution from '../entities/RecipeAttribution'
import { MealTypeEnum, DifficultyEnum, CostEnum } from '../entities/Recipe'

export default class CreateRecipes implements Seeder {
  public async run(factory: any, connection: Connection): Promise<any> {
    const recipeAttribution = await connection
      .getRepository(RecipeAttribution)
      .findOne()
    await factory(Recipe)({
      mealType: MealTypeEnum.Breakfast,
      difficulty: DifficultyEnum.Easy,
      cost: CostEnum.Budget,
      recipeAttribution
    }).seedMany(3)
  }
}
