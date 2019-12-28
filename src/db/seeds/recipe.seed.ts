import { Seeder, Factory } from 'typeorm-seeding'
import { Connection } from 'typeorm'

import Recipe from '../entities/Recipe'
import RecipeSeedData from '../seedData/recipes'

export default class CreateRecipes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const db = await connection.getConnection()
  }
}
