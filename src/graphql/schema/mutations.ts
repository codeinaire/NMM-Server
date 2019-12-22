import { gql } from 'apollo-server-lambda'

export default gql`
  type Mutation {
    createArticles(articles: [CreateArticle]!): [Article]
    createArticle(article: CreateArticle!): Article

    createUserProfile(userProfileInput: UserProfileInput): UserProfile

    createRecipe(recipe: RecipeInput): Recipe
    deleteRecipe(title: String): Recipe

    createOrUpdateChallenge(challengeInput: ChallengeInput): Challenge
  }
`
