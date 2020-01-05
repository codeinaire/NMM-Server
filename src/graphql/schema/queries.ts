const { gql } = require('apollo-server-lambda')

export default gql`
  type Query {
    challenge: Challenge
    recipes: [Recipe]!
    recipe(recipeId: ID!): Recipe!
    articles: [Article]
    me(id: String!): UserProfile
  }
`
