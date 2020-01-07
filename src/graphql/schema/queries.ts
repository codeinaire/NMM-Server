const { gql } = require('apollo-server-lambda')

export default gql`
  type Query {
    challenge(recipeId: ID!): Challenge
    recipes: [Recipe]!
    articles: [Article]
    me(id: String!): UserProfile
  }
`
