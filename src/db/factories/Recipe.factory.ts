import { define } from 'typeorm-seeding'
import * as Faker from 'faker'

import Recipe from '../entities/Recipe'
import { DifficultyEnum, CostEnum, MealTypeEnum } from '../entities/Recipe'
import RecipeAttribution from '../entities/RecipeAttribution'

define(Recipe, (
  faker: typeof Faker,
  settings: {
    mealType: MealTypeEnum
    difficulty: DifficultyEnum
    cost: CostEnum
    recipeAttribution: RecipeAttribution
  }
) => {
  const title = faker.lorem.words(2)
  const ingredients = faker.lorem.paragraph(2)
  const method = faker.lorem.paragraph(3)

  const recipe = new Recipe()
  recipe.title = title
  recipe.ingredients = ingredients
  recipe.method = method
  recipe.hashtags = [
    '#theclumsyvegan',
    '#meatballs',
    '#spaghetti',
    '#nomeatmay'
  ]
  recipe.lowResolution = 'test url for low res'
  recipe.standardResolution = 'test url for standard res'
  recipe.mealType = settings.mealType
  recipe.difficulty = settings.difficulty
  recipe.cost = settings.cost
  recipe.recipeAttribution = settings.recipeAttribution

  return recipe
})
