import { gql } from 'apollo-server-lambda'

export default gql`
  type Mutation {
    createArticles(articles: [CreateArticle]!): [Article]
    createArticle(article: CreateArticle!): Article

    createUserProfile(userProfileInput: UserProfileInput): UserProfile

    createRecipe(recipe: RecipeInput): Recipe
    deleteRecipe(title: String): Recipe

    createChallenge(challengeInput: ChallengeInput): String
  }
`
