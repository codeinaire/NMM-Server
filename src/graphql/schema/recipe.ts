const { gql } = require('apollo-server-lambda');

export default gql`
   enum DifficultyEnum {
    Easy
    Medium
    Hard
  }

  enum CostEnum {
    Budget
    Moderate
    Expensive
  }

  enum MealTypeEnum {
    Breakfast
    Lunch
    Dinner
    Snack
  }

  type Recipe {
    "**LIST && SHOW**"
    id: ID!
    title: String!
    difficulty: DifficultyEnum!
    cost: CostEnum!
    mealType: MealTypeEnum!
    hashtags: String!
    "**LIST**"
    lowResolution: String!
    "**SHOW**"
    attribution: Attribution!
    ingredients: String!
    method: String!
    standardResolution: String!
  }

  type Attribution {
    name: String!
    website: String!
    email: String!
    socialMedia: AttributionSocialMedia
  }

  type AttributionSocialMedia {
    facebook: String
    instagram: String
    twitter: String
  }

  input RecipeInput {
    title: String!
    name: String!
    email: String!
    website: String!
    facebook: String
    instagram: String
    twitter: String
    ingredients: String!
    method: String!
    hashtags: String!
    difficulty: DifficultyEnum!
    cost: CostEnum!
    mealType: MealTypeEnum!
    lowResolution: String!
    standardResolution: String!
  }
`