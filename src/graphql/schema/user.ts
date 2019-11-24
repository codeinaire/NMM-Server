const { gql } = require('apollo-server-lambda');

export default gql`
  type UserProfile{
    id: ID!
    totalPoints: Int!
    challengeGoals: Int!
    motivations: String!
    username: String!
    bio: String
    profilePic: String
  }

  input UserProfileInput{
    id: ID!
    challengeGoals: Int!
    motivations: String!
    username: String!
    bio: String
    profilePic: String
  }
`
