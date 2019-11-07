import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import Recipe from '../entities/Recipe';
import { DifficultyEnum, CostEnum, MealTypeEnum } from '../entities/Recipe';

define(Recipe, (faker: typeof Faker, settings: { mealType: MealTypeEnum, difficulty: DifficultyEnum, cost: CostEnum}) => {
  const title = faker.lorem.words(2)
  const ingredients = faker.lorem.paragraph(2)
  const method = faker.lorem.paragraph(3)

  const recipe = new Recipe()
  recipe.title = title
  recipe.ingredients = ingredients
  recipe.method = method
  recipe.hashtags = '#theclumsyvegan#meatballs#spaghetti#nomeatmay'
  recipe.mealType = settings.mealType
  recipe.difficulty = settings.difficulty
  recipe.cost = settings.cost

  return recipe
})