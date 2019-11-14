import { Container } from 'inversify'
import { TYPES } from './inversifyTypes'
import RecipeAPI, { RecipeApiClass } from './graphql/datasources/recipe'
import { Database, DatabaseClass } from './db'

const myContainer = new Container()
myContainer.bind<RecipeApiClass>(TYPES.RecipeAPI).to(RecipeAPI)
myContainer.bind<DatabaseClass>(TYPES.Database).to(Database)

export { myContainer }