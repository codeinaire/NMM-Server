import { define } from 'typeorm-seeding';
import Recipe from '../entity/Recipe';

import { DifficultyEnum, CostEnum, MealTypeEnum } from '../entity/Recipe';

define(Recipe, (faker: any) => {
  const title = faker.lorem.word(2)
  const ingredients = faker.lorem.paragraphCount(2)
  const method = faker.lorem.paragraphCount(3)

  const recipe = new Recipe()
  recipe.title = title;
  recipe.ingredients = ingredients;
  recipe.method = method;
  recipe.hashtag = '#theclumsyvegan#meatballs#spaghetti#nomeatmay';
  recipe.mealType = MealTypeEnum.Breakfast;
  recipe.difficulty = DifficultyEnum.Easy;
  recipe.cost = CostEnum.Budget;
  recipe.thumbnail = {"width":150,"height":150,"url":"https://scontent.cdninstagram.com/vp/d81852af0e88f80d57d40e2b0afe98b2/5E261FB5/t51.2885-15/e35/s150x150/62104753_159244668451690_512719217158222185_n.jpg?_nc_ht=scontent.cdninstagram.com"};
  recipe.lowResolution = {"width":320,"height":320,"url":"https://scontent.cdninstagram.com/vp/9e2f33db2bbcb0b3932fca1d4a6dda64/5E30B2B8/t51.2885-15/e35/s320x320/62104753_159244668451690_512719217158222185_n.jpg?_nc_ht=scontent.cdninstagram.com"};
  recipe.standardResolution = {"width":640,"height":640,"url":"https://scontent.cdninstagram.com/vp/3981a2718c57865e8a65ee76fe95a79a/5E210427/t51.2885-15/e35/62104753_159244668451690_512719217158222185_n.jpg?_nc_ht=scontent.cdninstagram.com"};
  recipe.createdAt = new Date();
  return recipe;
})