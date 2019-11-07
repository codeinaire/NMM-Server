import { Seeder, FactoryFunction } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import Recipe from '../entities/Recipe';
const RecipeSeedData = require ('../seedData/recipes');

export default class CreateRecipes implements Seeder {
  public async run(factory: FactoryFunction, connection: Connection): Promise<any> {
    const connection = await factory.getConnection()
  }
}