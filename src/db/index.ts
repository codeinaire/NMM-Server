import {createConnection} from "typeorm";

// TODO - these need to be replace with the production values, and/or a way to change values from prod to dev with config ENV VARS!!!
// TODO - add connection pooling for production
createConnection().then((connection) => {
  console.log('connection', connection);
  console.log('Connection has been established successfully!');
})
.catch(err => {
  console.error(`Unable to connect to the database: ${err}`);
});