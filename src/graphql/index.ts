import "reflect-metadata";
import { ApolloServer } from 'apollo-server-lambda';
// GRAPHQL
import RecipeAPI from './datasources/recipe';
import schema from './schema';

// DB
// import database from '../db';

// AUTH
import Auth from '../utils/auth';

// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda';

// createConnection().then((connection) => {
//   console.log('connection', connection);
//   console.log('Connection has been established successfully!');
// })
// .catch(err => {
//   console.error(`Unable to connect to the database: ${err}`);
// });
// database();
// const store = getConnection();
// console.log('DATABASE!!!', store.options.entities);

// This won't work as the code after the promise will run before the promise is done
// let RecipeEntity: any;
// database().then(value => {
//   const { RecipeRepository } = value;
//   console.log('RecipeRepository', RecipeRepository);

//   RecipeEntity = RecipeRepository;
// }).then(err => console.error(err));

// console.log('RecipeEntity', RecipeEntity );

const dataSources = () => ({
  recipeAPI: new RecipeAPI()
});

const context = ({ event } : { event: APIGatewayProxyEvent }) => {
  return {
    event,
    auth: new Auth()
  }
};

const server = new ApolloServer({
  schema,
  dataSources,
  context
})

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  schema,
  RecipeAPI,
  ApolloServer,
  server,
  Auth
};