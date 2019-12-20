import { injectable, inject } from 'inversify'
// DB Entities
import UserProfileEntity from '../../db/entities/UserProfile'

// TYPES
import { UserProfileInput } from '../types'
import { TYPES } from '../../inversifyTypes'
import { IUserProfileAPI, IDatabase, ICalculatePoints } from '../../types'
import { Connection } from 'typeorm'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class UserProfileAPI implements IUserProfileAPI {
  private readonly DEFAULT_LOW_RES_PROFILE_PIC_URL =
    'https://res.cloudinary.com/codeinaire/image/upload/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'
  private readonly DEFAULT_STD_RES_PROFILE_PIC_URL =
    'https://res.cloudinary.com/codeinaire/image/upload/c_scale,q_auto,w_640/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'
  private readonly DEFAULT_BIO_INFO = 'Fill in your bio for more points!'
  private readonly DEFAULT_CHALLENGE_QUOTE =
    'What is a quote that inspires you to change?'

  private readonly calculatePoints: ICalculatePoints
  private context: any
  private db: Connection
  @inject(TYPES.Database) private database: IDatabase
  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints
  ) {
    this.calculatePoints = calculatePoints
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets   called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
    this.db = await this.database.getDatabase()
  }

  public async findUserProfile(verifiedId: string) {
    this.context
    const userProfile = await this.db.getRepository(UserProfileEntity).findOne({
      where: {
        id: verifiedId
      }
    })

    return userProfile
  }

  public async createUserProfile(
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

    const calculatedPoints = this.calculatePoints.calculate(
      userProfileInput,
      challengeType
    )

    let userProfile = new UserProfileEntity()
    userProfile.id = id as string
    userProfile.motivations = motivations
    userProfile.challengeGoals = challengeGoals
    userProfile.username = username
    userProfile.bio = bio || this.DEFAULT_BIO_INFO
    userProfile.lowResProfile =
      lowResProfile || this.DEFAULT_LOW_RES_PROFILE_PIC_URL
    userProfile.standardResolution =
      standardResolution || this.DEFAULT_STD_RES_PROFILE_PIC_URL
    userProfile.challengeQuote = challengeQuote || this.DEFAULT_CHALLENGE_QUOTE

    userProfile.totalPoints = calculatedPoints as number

    const savedUserProfile = await this.db
      .getRepository(UserProfileEntity)
      .save(userProfile)

    return savedUserProfile
  }

  public async closeDbConnection() {
    await this.db.close()
  }
}
