import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from "typeorm";

import Recipe from './entities/Recipe';

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
      console.info(`Database.getConnection()-using existing connection ...`);
      connection = await this.connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      console.info(`Database.getConnection()-creating connection ...`);

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
          Recipe
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

export default async () => {
  const database = new Database();

  const dbConn: Connection = await database.getConnection();
  return dbConn;
  // const RecipeRepository = await dbConn.getRepository(Recipe);

  // return {
  //   RecipeRepository
  // }
}

// import { createConnection, Connection } from "typeorm";

// TODO - these need to be replace with the production values, and/or a way to change values from prod to dev with config ENV VARS!!!
// TODO - add connection pooling for production
// createConnection().then((connection) => {
//   console.log('connection', connection);
//   console.log('Connection has been established successfully!');
// })
// .catch(err => {
//   console.error(`Unable to connect to the database: ${err}`);
// });

// export default async () => {
//   const connection: Connection = await createConnection();

//   console.log('connection', connection);

// const RecipeRepository = getRepository(Recipe);

// return {
//   RecipeRepository
// }
// }

// import { Sequelize, DataTypes } from 'sequelize';
// import ArticleModel from './models/article';
// import RecipeModel from './models/recipe';
// import UserModel from './models/user';

// export default () => {
//   // TODO - these need to be replace with the production values, and/or a way to change values from prod to dev with config ENV VARS!!!
//   const sequelize = new Sequelize('no-meat-may', 'no-meat-may', 'aoeui12345', {
//     host: 'localhost',
//     dialect: 'postgres'
//   });

//   const articles = ArticleModel(sequelize, DataTypes);
//   const recipes = RecipeModel(sequelize, DataTypes);
//   const users = UserModel(sequelize, DataTypes)
//   // TODO - This is causing DB connection error in tests.
//   // sequelize.sync({ force: false }).then(() => {
//   //   console.log('Database & tables created');
//   // })

//   return {
//     articles,
//     recipes,
//     users
//   };
// };
