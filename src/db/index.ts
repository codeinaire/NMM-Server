import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from "typeorm";

import Recipe from './entities/Recipe'
import RecipeAttribution from './entities/RecipeAttribution'
import AttributionSocialMedia from './entities/AttributionSocialMedia'

/**
 * Database manager class
 */
export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`;

    let connection: Connection;

    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.info(`Database.getConnection() - using existing connection ...`);
      connection = await this.connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      console.info(`Database.getConnection() - creating connection ...`);

      const connectionOptions: ConnectionOptions = {
        name: `default`,
        type: `postgres`,
        port: 5432,
        synchronize: true,
        logging: "all",
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        entities: [
          Recipe,
          RecipeAttribution,
          AttributionSocialMedia
        ]
      };

      // Don't need a pwd locally
      if (process.env.DB_PASSWORD) {
        Object.assign(connectionOptions, {
          password: process.env.DB_PASSWORD
        });
      }

      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}

// TODO - test to see if this does reuse a connection
export default async () => {
  const database = new Database();

  const dbConn: Connection = await database.getConnection();
  return dbConn;
}
