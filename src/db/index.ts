import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from 'typeorm'
import { injectable } from 'inversify'
import { production, test, development } from './dbConnectionConfig'

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
    const currentEnv =
        process.env.NODE_ENV == 'production'
          ? 'production'
          : process.env.NODE_ENV == 'test'
          ? 'test'
          : 'development'
    const CONNECTION_NAME = currentEnv == 'development' ? 'default' : 'test'

    if (this.connectionManager.has(CONNECTION_NAME)) {
      // TODO - maybe switch console.info out for Logger
      console.info(`Using existing DB connection for ${currentEnv}`)
      this.connection = await this.connectionManager.get(CONNECTION_NAME)

      if (!this.connection.isConnected) {
        this.connection = await this.connection.connect()
      }
    } else {
      console.info(`Creating DB connection for ${currentEnv}`)

      let connectionOptions: ConnectionOptions = development
      if (currentEnv == 'production') connectionOptions = production
      if (currentEnv == 'test') connectionOptions = test

      this.connection = await createConnection(connectionOptions)
    }

    return this.connection
  }

  public async getDatabase() {
    return await this.getConnection()
  }
}
