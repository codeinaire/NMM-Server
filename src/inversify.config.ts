import { Container } from 'inversify'
import { TYPES } from './inversifyTypes'
import RecipeAPI, { IRecipeAPI } from './graphql/datasources/recipe'
import { Database, IDatabase } from './db'
import { Server, IServer } from './server'

const container = new Container()
container.bind<IRecipeAPI>(TYPES.RecipeAPI).to(RecipeAPI)
container.bind<IDatabase>(TYPES.Database).to(Database)
container.bind<IServer>(TYPES.Server).to(Server)

export { container }