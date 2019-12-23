import { injectable, inject } from 'inversify'
// DB Entities
import ChallengeEntity from '../../db/entities/Challenge'
import UserProfileEntity from '../../db/entities/UserProfile'
import RecipeEntity from '../../db/entities/Recipe'
import CompletedChallengeEntity from '../../db/entities/CompletedChallenge'
import UncompletedChallengeEntity from '../../db/entities/UncompletedChallenge'

// TYPES
import { ChallengeInput, TypeEnum } from '../types'
import { TYPES } from '../../inversifyTypes'
import {
  ILogger,
  IChallengeAPI,
  IDatabase,
  ICalculatePoints
} from '../../types'
import { Connection } from 'typeorm'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class ChallengeAPI implements IChallengeAPI {
  private readonly calculatePoints: ICalculatePoints
  private readonly logger: ILogger
  // private context: any
  private db: Connection
  @inject(TYPES.Database) private database: IDatabase
  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints,
    @inject(TYPES.Logger) Logger: ILogger
  ) {
    // eslint-disable-next-line prettier/prettier
    this.calculatePoints = calculatePoints
    this.logger = Logger
  }

  public async initialize(config: DataSourceConfig<any>) {
    // this.context = config.context
    this.db = await this.database.getDatabase()
  }

  /**
   * findChallenge
   */
  public async findChallenge() {
    const challenge = await this.db.getRepository(ChallengeEntity).findOne({
      id: 4
    })

    return challenge
  }

  public async createOrUpdateChallenge(
    challengeInput: ChallengeInput,
    challengeType: TypeEnum,
    verifiedUser: string
  ) {
    const MAX_RECIPE_SECTIONS_COMPLETABLE = 4
    const POINTS_PER_SECTION_COMPLETED = 10
    const ALL_SECTIONS_COMPLETED_BONUS = 25
    const {
      type,
      sectionsCompleted,
      difficulty,
      lowResSharedFriendsImage,
      standardResolution,
      recipeId
    } = challengeInput

    // Calculate challenge points, update UserProfileEntity
    // with new total, & get updated UserProfile object
    const calculatedPoints = this.calculatePoints.calculate(
      challengeInput,
      challengeType
    )

    const ERROR_NO_AFFECTED_ROWS = 0
    const updatedUserProfile = await this.db
      .getRepository(UserProfileEntity)
      .increment({ id: verifiedUser }, 'totalPoints', calculatedPoints)
    if (updatedUserProfile.affected == ERROR_NO_AFFECTED_ROWS) {
      this.logger.getLogger().error('UserProfile totalPoints not updated')
      throw new Error('UserProfile totalPoints not update. Try again!')
    }

    const updatedUserProfileObject = await this.db
      .getRepository(UserProfileEntity)
      .findOne(verifiedUser)
    if (updatedUserProfileObject == undefined) {
      this.logger.getLogger().error('UserProfile not found')
      throw new Error('UserProfile not found')
    }

    let challenge: ChallengeEntity | undefined
    challenge = await this.db
      .getRepository(ChallengeEntity)
      .findOne({ userProfileId: verifiedUser, recipeId })
    // Create/Update ChallengeEntity
    if (challenge == undefined) challenge = new ChallengeEntity()
    challenge.userProfile = updatedUserProfileObject
    challenge.awardedPoints = calculatedPoints
    challenge.type = type
    challenge.difficulty = difficulty
    if (!!sectionsCompleted) challenge.sectionsCompleted = sectionsCompleted
    if (type == 'Recipe') {
      challenge.maxAwardablePoints =
        POINTS_PER_SECTION_COMPLETED * MAX_RECIPE_SECTIONS_COMPLETABLE +
        ALL_SECTIONS_COMPLETED_BONUS
      challenge.maxSectionsCompletable = MAX_RECIPE_SECTIONS_COMPLETABLE
    }

    let sharedFriendsImages = {
      lowResSharedFriendsImage: '',
      standardResolution: ''
    }
    if (typeof lowResSharedFriendsImage == 'string') {
      sharedFriendsImages.lowResSharedFriendsImage = lowResSharedFriendsImage
      challenge.sharedFriendsImages = sharedFriendsImages
    }
    if (typeof standardResolution == 'string') {
      sharedFriendsImages.standardResolution = standardResolution
      challenge.sharedFriendsImages = sharedFriendsImages
    }

    const recipe = await this.db.getRepository(RecipeEntity).findOne(recipeId)
    if (recipe) challenge.recipe = recipe

    const savedChallenge = await this.db
      .getRepository(ChallengeEntity)
      .save(challenge)

    // Create/Update Un/CompleteChallengeEntity
    const numberOfSectionsCompleted = sectionsCompleted.length
    if (numberOfSectionsCompleted == MAX_RECIPE_SECTIONS_COMPLETABLE) {
      let completedChallenge = new CompletedChallengeEntity()
      completedChallenge.userProfile = updatedUserProfileObject
      completedChallenge.challenge = savedChallenge
      await this.db
        .getRepository(CompletedChallengeEntity)
        .save(completedChallenge)
      // Delete uncompleted entity when challenge complete
      await this.db
        .getRepository(UncompletedChallengeEntity)
        .delete({ userProfileId: verifiedUser, challengeId: savedChallenge.id })
    } else {
      let uncompletedChallenge = await this.db
        .getRepository(UncompletedChallengeEntity)
        .findOne({
          userProfileId: verifiedUser,
          challengeId: savedChallenge.id
        })
      if (uncompletedChallenge == undefined) {
        uncompletedChallenge = new UncompletedChallengeEntity()
        uncompletedChallenge.userProfile = updatedUserProfileObject
        uncompletedChallenge.challenge = savedChallenge
        await this.db
          .getRepository(UncompletedChallengeEntity)
          .save(uncompletedChallenge)
      }
    }
    // Remove Recipe object from returned object
    if (type == 'Recipe') delete savedChallenge.recipe

    return savedChallenge
  }
}
