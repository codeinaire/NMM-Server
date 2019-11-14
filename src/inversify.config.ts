import { Container } from 'inversify'
import { TYPES } from './inversifyTypes'
import RecipeAPI, { IRecipeAPI } from './graphql/datasources/recipe'
import { Database, IDatabase } from './db'
import { Server, IServer } from './server'

const myContainer = new Container()
myContainer.bind<IRecipeAPI>(TYPES.RecipeAPI).to(RecipeAPI)
myContainer.bind<IDatabase>(TYPES.Database).to(Database)
myContainer.bind<IServer>(TYPES.Server).to(Server)

export { myContainer }