import { gql } from 'apollo-server-lambda';

export default gql`
  type Mutation {
    createArticles(articles: [CreateArticle]!): [Article]
    createArticle(article: CreateArticle!): Article
    createProfile: User
  }
`