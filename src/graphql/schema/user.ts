const { gql } = require('apollo-server-lambda');

export default gql`
  type User {
    id: ID!
    points: Int!
    recipeRead: [Int]
  }

`