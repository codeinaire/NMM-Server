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
import { IChallengeAPI, IDatabase, ICalculatePoints } from '../../types'
import { Connection } from 'typeorm'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class ChallengeAPI implements IChallengeAPI {
  private readonly calculatePoints: ICalculatePoints
  // private context: any
  private db: Connection
  @inject(TYPES.Database) private database: IDatabase
  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints
  ) {
    this.calculatePoints = calculatePoints
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

  public async createChallenge(
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

    const calculatedPoints = this.calculatePoints.calculate(
      challengeInput,
      challengeType
    )

    await this.db
      .createQueryBuilder()
      .update(UserProfileEntity)
      .set({
        totalPoints: () => `'totalPoints' = 'totalPoints' + ${calculatedPoints}`
      })
      .where('id = :id', { id: verifiedUser })

    // update OrderDetails
    // set Quantity = Quantity + 6
    // where OrderDetailID = 1

    const [userProfileObject] = await this.db
      .getRepository(UserProfileEntity)
      .find({
        where: {
          id: verifiedUser
        }
      })

    let challenge = new ChallengeEntity()
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

    const numberOfSectionsCompleted = sectionsCompleted.length
    if (numberOfSectionsCompleted == MAX_RECIPE_SECTIONS_COMPLETABLE) {
      let completedChallenge = new CompletedChallengeEntity()
      completedChallenge.userProfile = userProfileObject
      completedChallenge.challenge = savedChallenge
      await this.db
        .getRepository(CompletedChallengeEntity)
        .save(completedChallenge)
    } else {
      let uncompletedChallenge = new UncompletedChallengeEntity()
      uncompletedChallenge.userProfile = userProfileObject
      uncompletedChallenge.challenge = savedChallenge
      await this.db
        .getRepository(UncompletedChallengeEntity)
        .save(uncompletedChallenge)
    }
    if (type == 'Recipe') delete savedChallenge.recipe

    return savedChallenge
  }
}
