const { gql } = require('apollo-server-lambda')

export default gql`
  enum TypeEnum {
    Recipe
  }

  enum SectionsCompletedEnum {
    Ingredients
    Method
    ShareFriendsImage
    ShareRecipe
  }

  input ChallangeInput {
    type
  }

  type Challange {
    id: ID
    type: TypeEnum
    maxAwardablePoints: Int
    awardedPoints: Int
    maxSectionsCompletable: Int
    sectionsCompleted: [SectionsCompletedEnum]
    sharedFriendsImages: SharedFriendsImage
  }

  type SharedFriendsImage {
    lowResolution: String
    standardResolution: String
  }
`
