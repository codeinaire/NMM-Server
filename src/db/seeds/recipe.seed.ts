import { Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import Recipe from '../entities/Recipe';
const RecipeSeedData = require ('../seedData/recipes');

export default class CreateRecipes implements Seeder {
  public async run(factory: FactoryInterface, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Recipe)
      .values(RecipeSeedData)
      .execute()
  }
}