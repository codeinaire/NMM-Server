const { gql } = require('apollo-server-lambda');

export default gql`
  type Query {
    challenge: Challenge
    recipes: [Recipe]!
    articles: [Article]
    me(id: String!): UserProfile
  }
`