import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from 'typeorm'
import { injectable } from 'inversify'

// ENTITIES
import Recipe from './entities/Recipe'
import RecipeAttribution from './entities/RecipeAttribution'
import AttributionSocialMedia from './entities/AttributionSocialMedia'

import { IDatabase } from '../types'

/**
 * Database manager class
 */
@injectable()
export class Database implements IDatabase {
  private connectionManager: ConnectionManager
  private connection: Connection

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  private async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = 'default'

    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.info('Database.getConnection() - using existing connection ...')
      this.connection = await this.connectionManager.get(CONNECTION_NAME)

      if (!this.connection.isConnected) {
        this.connection = await this.connection.connect()
      }
    } else {
      console.info('Database.getConnection() - creating connection ...')

      const connectionOptions: ConnectionOptions = {
        name: 'default',
        type: 'postgres',
        port: 5432,
        synchronize: true,
        logging: 'all',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        entities: [Recipe, RecipeAttribution, AttributionSocialMedia]
      }

      // Don't need a pwd locally
      if (process.env.DB_PASSWORD) {
        Object.assign(connectionOptions, {
          password: process.env.DB_PASSWORD
        })
      }

      this.connection = await createConnection(connectionOptions)
    }

    return this.connection
  }

  public async getDatabase() {
    return await this.getConnection()
  }
}
