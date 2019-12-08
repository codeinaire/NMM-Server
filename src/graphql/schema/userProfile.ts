const { gql } = require('apollo-server-lambda');

export default gql`
  type UserProfile {
    id: ID
    totalPoints: Int!
    challengeGoals: Int!
    motivations: String!
    username: String!
    bio: String
    lowResProfile: String
    standardResolution: String
    challengeQuote: String
  }

  input UserProfileInput {
    id: ID!
    challengeGoals: Int!
    motivations: String!
    username: String!
    bio: String
    lowResProfile: String
    standardResolution: String
    challengeQuote: String
  }
`
