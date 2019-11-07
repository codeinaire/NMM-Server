import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import RecipePhoto from '../entities/RecipePhoto';
import { RecipePhotoTypeEnum } from '../entities/RecipePhoto';

define(RecipePhoto, (faker: typeof Faker, settings: { photoType: RecipePhotoTypeEnum, height: number, width: number }) => {
  const url = faker.image.cats(settings.width, settings.height)

  const recipePhotoStandard = new RecipePhoto()
  recipePhotoStandard.type = settings.photoType
  recipePhotoStandard.width = settings.width
  recipePhotoStandard.height = settings.height
  recipePhotoStandard.url = url

  return recipePhotoStandard;
})