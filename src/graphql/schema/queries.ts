const { gql } = require('apollo-server-lambda');

export default gql`
  type Query {
    recipes: [Recipe]!
    articles: [Article]
    me: User
  }
`