import { injectable, inject } from 'inversify'
// DB Entities
import UserProfileEntity from '../../db/entities/UserProfile'
import ChallengeEntity from '../../db/entities/Challenge'
// TYPES
import { UserProfileInput, TypeEnum, ChallengeDifficultyEnum } from '../types'
import { TYPES } from '../../inversifyTypes'
import { IUserProfileAPI, IDatabase, ICalculatePoints } from '../../types'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class UserProfileAPI implements IUserProfileAPI {
  private readonly calculatePoints: ICalculatePoints
  private readonly database: IDatabase
  private context: any

  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints,
    @inject(TYPES.Database) database: IDatabase
  ) {
    this.calculatePoints = calculatePoints
    this.database = database
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets   called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  public async findUserProfile(verifiedUserId: string) {
    const db = await this.database.getConnection()
    const userProfile = await db.getRepository(UserProfileEntity).findOne({
      where: {
        id: verifiedUserId
      }
    })

    return userProfile
  }

  public async createOrUpdateUserProfile(
    userProfileInput: UserProfileInput,
    challengeType: string
  ) {
    const {
      id,
      motivations,
      challengeGoals,
      username,
      bio,
      lowResProfile,
      standardResolution,
      challengeQuote
    } = userProfileInput
    const db = await this.database.getConnection()

    // * 1. check if challenge exists
    let challenge: ChallengeEntity | undefined
    challenge = await db
      .getRepository(ChallengeEntity)
      .findOne({ where: { userProfileId: id, type: TypeEnum.UserProfile } })
    // * 1.a. Chek if challenge doesn't exist, create new challenge
    if (typeof challenge === 'undefined') challenge = new ChallengeEntity()
    // * 1.b. Check if challenge is complete, if complete return Challenge
    if (challenge.completed) return challenge

    // * 2.check if user profile exists
    const checkSavedUserProfile = await db
      .getRepository(UserProfileEntity)
      .findOne({
        where: {
          id
        }
      })
    let userProfile
    if (typeof checkSavedUserProfile === 'undefined') {
      userProfile = new UserProfileEntity()
      userProfile.id = id as string
    } else userProfile = checkSavedUserProfile

    // * 3 Calculate points & update challenge entity
    const {
      updatedChallenge,
      amountToAddToUserProfile
    } = this.calculatePoints.calculate(
      userProfileInput,
      challenge,
      challengeType
    )
    // * 4 Save challenge entity
    const savedChallenge = await db
      .getRepository(ChallengeEntity)
      .save(updatedChallenge)
    console.info(`User Profile - challenge ${savedChallenge.id} saved`)

    // * 5 Update user profile total points
    const ERROR_NO_AFFECTED_ROWS = 0
    const updatedUserProfile = await db
      .getRepository(UserProfileEntity)
      .increment({ id: id as string }, 'totalPoints', amountToAddToUserProfile)
    if (updatedUserProfile.affected == ERROR_NO_AFFECTED_ROWS) {
      console.error(
        `UserProfile totalPoints not updated: ${JSON.stringify(
          updatedUserProfile
        )}`
      )
      throw new Error(
        'Challenge - UserProfile totalPoints not updated. Try again!'
      )
    }
    // * 6 Update user profile attributes
    userProfile.motivations = motivations
    userProfile.challengeGoals = challengeGoals
    userProfile.username = username
    // N.B. If no value given, default value set in DB.
    if (typeof bio == 'string') userProfile.bio = bio
    if (typeof standardResolution == 'string')
      userProfile.standardResolution = standardResolution
    if (typeof challengeQuote == 'string')
      userProfile.challengeQuote = challengeQuote
    if (typeof lowResProfile == 'string')
      userProfile.lowResProfile = lowResProfile

    // * 7 Save and return user profile
    const savedUserProfile = await db
      .getRepository(UserProfileEntity)
      .save(userProfile)

    return savedUserProfile
  }

  public async closeDbConnection() {
    const db = await this.database.getConnection()
    await db.close()
  }
}
