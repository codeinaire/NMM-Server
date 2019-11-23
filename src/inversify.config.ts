import { Container } from 'inversify'
import { TYPES } from './inversifyTypes'
import RecipeAPI from './graphql/datasources/recipe'
import { Database } from './db'
import { Server } from './server'
import { Logger } from './utils/Logger'
import { Authorisation } from './utils/Authorisation'

import { IRecipeAPI, IServer, IDatabase, ILogger, IAuthorisation } from './types'

const container = new Container()
container.bind<IRecipeAPI>(TYPES.RecipeAPI).to(RecipeAPI)
container.bind<IDatabase>(TYPES.Database).to(Database)
container.bind<IServer>(TYPES.Server).to(Server)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IAuthorisation>(TYPES.Authorisation).to(Authorisation)

export { container }