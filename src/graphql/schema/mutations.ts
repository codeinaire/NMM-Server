import { gql } from 'apollo-server-lambda';

export default gql`
  type Mutation {
    createArticles(articles: [CreateArticle]!): [Article]
    createArticle(article: CreateArticle!): Article

    createProfile(userProfile: UserProfileInput): UserProfile

    createRecipe(recipe: RecipeInput): Recipe
    deleteRecipe(title: String): Recipe
  }
`