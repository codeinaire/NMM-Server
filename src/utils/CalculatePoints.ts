import { injectable } from 'inversify'

import ChallengeEntity from '../db/entities/Challenge'
import { ICalculatePoints } from '../types'
import {
  ChallengeInput,
  UserProfileInput,
  SectionsCompletedEnum,
  TypeEnum
} from '../graphql/types'

@injectable()
export default class CalculatePoints implements ICalculatePoints {
  private readonly POINTS_PER_SECTION_COMPLETED = 10
  private readonly ALL_SECTIONS_COMPLETED_BONUS = 25
  public constructor() {}

  /**
   * @remarks
   * This is to create the appropriate data type for the sectionsCompleted
   * property in the challenge entity
   *
   * @param section - a key from the user profile input
   * @returns SectionsCompletedEnum - a key from the enum
   */
  private addSection(section: string) {
    switch (section) {
      case 'motivations':
        return SectionsCompletedEnum.Motivations
      case 'challengeGoals':
        return SectionsCompletedEnum.ChallengeGoals
      case 'username':
        return SectionsCompletedEnum.Username
      case 'bio':
        return SectionsCompletedEnum.Bio
      case 'lowResProfile':
        return SectionsCompletedEnum.LowResProfile
      case 'challengeQuote':
        return SectionsCompletedEnum.ChallengeQuote
      default:
        return SectionsCompletedEnum.None
    }
  }

  /**
   * @remarks
   * Each item for UserProfileInput is worth 10 points. There are 7
   * in total. If all are completed the user is rewarded an extra 25 points.
   * Only completed items pass through. Which is why I'm not using
   * default value for the arguments of the userProfile class.
   *
   * The 6 completeable items are:
   * - challengeGoals (required)
   * - username (required)
   * - motivations (required)
   * - bio
   * - lowResProfile
   * - challengeQuote
   *
   * @param userProfile - a UserProfileInput object
   * @param challenge - challenge entity
   * @returns challenge - challenge entity
   */
  private calculateUserProfilePoints(
    userProfile: UserProfileInput,
    challenge: ChallengeEntity
  ) {
    const MAX_COMPLETABLE_ITEMS = 6
    const maxAwardablePoints =
      MAX_COMPLETABLE_ITEMS * this.POINTS_PER_SECTION_COMPLETED +
      this.ALL_SECTIONS_COMPLETED_BONUS
    const sectionsArray = Object.keys(userProfile)

    // Calculate points
    const completedSections = sectionsArray.length
    let sectionsCompletedSumTotal =
      completedSections * this.POINTS_PER_SECTION_COMPLETED
    if (completedSections == MAX_COMPLETABLE_ITEMS)
      sectionsCompletedSumTotal += this.ALL_SECTIONS_COMPLETED_BONUS
    const awardedPoints = Math.floor(sectionsCompletedSumTotal)

    // Update/Add challenge sections
    const sectionsCompleted: Array<SectionsCompletedEnum> = sectionsArray.map(
      (section: string) => {
        return this.addSection(section)
      }
    )
    challenge.sectionsCompleted = sectionsCompleted
    challenge.maxSectionsCompletable = MAX_COMPLETABLE_ITEMS
    challenge.maxAwardablePoints = maxAwardablePoints
    challenge.awardedPoints = awardedPoints
    if (maxAwardablePoints === awardedPoints) challenge.completed = true

    return challenge
  }

  /**
   * @remarks
   * Each section in sectionsCompleted[] is worth 10 points. There are 4
   * in total. The sectionsCompletedSumTotal is multiplied by the difficultly level.
   * They are 1, 1.15, 1.30.
   * If all are completed the user is rewarded an extra 25 points.
   * The 4 completeable items are:
   * - Ingredients
   * - Method
   * - SharedFriendsImage
   * - SharedRecipe
   *
   * @param { sectionsCompleted, difficultly } - ChallengeInput object
   * @param challenge - challenge entity
   * @returns challenge entity
   */
  private calculateRecipeChallengePoints(
    { sectionsCompleted, difficulty }: ChallengeInput,
    challenge: ChallengeEntity
  ) {
    const MAX_COMPLETABLE_ITEMS = 4
    const difficultyAsNumber = (difficulty as unknown) as number
    const maxAwardablePoints =
      (MAX_COMPLETABLE_ITEMS * this.POINTS_PER_SECTION_COMPLETED +
        this.ALL_SECTIONS_COMPLETED_BONUS) *
      difficultyAsNumber

    // calculate points
    const completedSections = sectionsCompleted.length
    let sectionsCompletedSumTotal =
      completedSections * this.POINTS_PER_SECTION_COMPLETED * difficultyAsNumber
    if (completedSections == MAX_COMPLETABLE_ITEMS)
      sectionsCompletedSumTotal += this.ALL_SECTIONS_COMPLETED_BONUS
    const awardedPoints = Math.floor(sectionsCompletedSumTotal)

    // Update/Add challenge sections
    challenge.difficulty = difficulty
    challenge.sectionsCompleted = sectionsCompleted
    challenge.maxSectionsCompletable = MAX_COMPLETABLE_ITEMS
    challenge.maxAwardablePoints = maxAwardablePoints
    challenge.awardedPoints = awardedPoints
    if (maxAwardablePoints === awardedPoints) challenge.completed = true

    return challenge
  }

  public calculate(
    challengeObject: any,
    challenge: ChallengeEntity,
    challengeType: string
  ): ChallengeEntity {
    if (!challengeType) throw new Error('No challengeType provided!')
    let updatedChallenge
    switch (challengeType) {
      case 'UserProfile':
        console.info(
          `Calculating points for user profile items: ${JSON.stringify(
            challengeObject
          )}`
        )
        updatedChallenge = this.calculateUserProfilePoints(
          challengeObject,
          challenge
        )
        updatedChallenge.type = TypeEnum.UserProfile
        console.info(`Calculated points: ${updatedChallenge.awardedPoints}`)
        return updatedChallenge
      case 'Recipe':
        console.info(`Calculating points for recipe challenge with items:
        ${challengeObject.sectionsCompleted.toString()}`)
        updatedChallenge = this.calculateRecipeChallengePoints(
          challengeObject,
          challenge
        )
        updatedChallenge.type = TypeEnum.Recipe
        console.info(`Calculated points: ${updatedChallenge.awardedPoints}`)
        return updatedChallenge
      default:
        throw new Error('No challenge type passed through! Try again!')
    }
  }
}
