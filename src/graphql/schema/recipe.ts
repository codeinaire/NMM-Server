const { gql } = require('apollo-server-lambda');

export default gql`
  type Recipe {
    id: ID!
    title: String!
    attribution: Attribution
    ingredients: String!
    method: String!
    hashtags: String!
    difficulty: DifficultyEnum!
    cost: CostEnum
    mealType: MealTypeEnum
    thumbnail: Thumbnail!
    standardResolution: StandardResolution!
    lowResolution: LowResolution!
  }

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

  type Attribution {
    name: String!
    url: String!
  }

  type StandardResolution {
    width: Int
    height: Int
    url: String
  }

  type LowResolution {
    width: Int!
    height: Int!
    url: String!
  }

  type Thumbnail {
    width: Int!
    height: Int!
    url: String!
  }
`