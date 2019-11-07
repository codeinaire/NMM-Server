import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import RecipeAttribution from '../entities/RecipeAttribution';

define(RecipeAttribution, (faker: typeof Faker) => {
  const name = faker.name.findName()
  const website = faker.internet.url()
  const email = faker.internet.email()

  const recipeAttribution = new RecipeAttribution()
  recipeAttribution.name = name
  recipeAttribution.website = website
  recipeAttribution.email = email

  return recipeAttribution;
})