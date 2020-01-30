import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from 'typeorm'
// Dependency injection
import { injectable, inject } from 'inversify'
import { TYPES } from '../inversifyTypes'

import { production, test, development } from './dbConnectionConfig'

import { IDatabase, ILogger } from '../types'
import { LambdaLog } from 'lambda-log'
/**
 * Database manager class
 */
@injectable()
export class Database implements IDatabase {
  private connectionManager: ConnectionManager
  private connection: Connection
  private readonly _logger: LambdaLog

  constructor(@inject(TYPES.Logger) Logger: ILogger) {
    this._logger = Logger.getLogger()
    this.connectionManager = getConnectionManager()
  }

  private async getConnection(): Promise<Connection> {
    this._logger.info('Selecting current environment')
    const currentEnv =
      process.env.ENV == 'production'
        ? 'production'
        : process.env.ENV == 'test'
        ? 'test'
        : 'development'
    const CONNECTION_NAME = currentEnv == 'development' ? 'default' : 'test'
    console.log('currentEnv', currentEnv, process.env.DB_HOST, process.env.ENV)

    if (this.connectionManager.has(CONNECTION_NAME)) {
      this._logger.info(`Using existing DB connection for ${currentEnv}`)
      this.connection = await this.connectionManager.get(CONNECTION_NAME)

      if (!this.connection.isConnected)
        this.connection = await this.connection.connect()
    } else {
      this._logger.info(`Creating DB connection for ${currentEnv}`)

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
