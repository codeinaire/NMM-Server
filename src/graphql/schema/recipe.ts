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
    url: String!
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
    attribution: AttributionInput!
    ingredients: String!
    method: String!
    hashtags: String!
    difficulty: DifficultyEnum!
    cost: CostEnum!
    mealType: MealTypeEnum!
    recipePhotos: [RecipePhotoInput]!
  }

  input AttributionInput {
    name: String!
    email: String!
    website: String!
    socialMedia: AttributionSocialMediaInput!
  }

  input AttributionSocialMediaInput {
    facebook: String
    instagram: String
    twitter: String
  }

  enum RecipePhotoInputEnum {
    StandardResolution
    Thumbnail
    LowResolution
  }

  input RecipePhotoInput {
    url: String!
    width: Int!
    height: Int!
    type: RecipePhotoInputEnum!
  }
`