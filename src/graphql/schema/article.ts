const { gql } = require('apollo-server-lambda');

export default gql`
  type Query {
    articles: [Article]
  }

  type Mutation {
    createArticles(articles: [CreateArticle]!): [Article]
    createArticle(article: CreateArticle!): Article
  }

  type Article {
    id: ID!
    title: String!
    content: String!
    hashtag: [String!]!
    type: String!
  }

  input CreateArticle {
    title: String!
    content: String!
    hashtag: [String!]!
    type: String!
  }
`