import { Container } from 'inversify'
import { TYPES } from './inversifyTypes'
import RecipeAPI from './graphql/datasources/recipe'
import UserProfileAPI from './graphql/datasources/userProfile'
import { Database } from './db'
import { Server } from './server'
import Logger from './utils/Logger'
import { Authorisation } from './utils/Authorisation'

import { IRecipeAPI, IUserProfileAPI, IServer, IDatabase, ILogger, IAuthorisation } from './types'

const container = new Container()
container.bind<IRecipeAPI>(TYPES.RecipeAPI).to(RecipeAPI)
container.bind<IUserProfileAPI>(TYPES.UserProfileAPI).to(UserProfileAPI)
container.bind<IDatabase>(TYPES.Database).to(Database)
container.bind<IServer>(TYPES.Server).to(Server)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IAuthorisation>(TYPES.Authorisation).to(Authorisation)

export { container }