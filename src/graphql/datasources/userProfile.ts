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
    // N.B. If no value given, default value set in DB.
    if (typeof bio == 'string') userProfile.bio = bio
    if (typeof standardResolution == 'string')
      userProfile.standardResolution = standardResolution
    if (typeof challengeQuote == 'string')
      userProfile.challengeQuote = challengeQuote
    if (typeof lowResProfile == 'string')
      userProfile.lowResProfile = lowResProfile

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
