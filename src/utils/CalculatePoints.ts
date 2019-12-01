import { injectable } from "inversify"
import { ICalculatePoints, IChallengeObject } from '../types'

@injectable()
export default class CalculatePoints implements ICalculatePoints {
  private readonly ALL_ITEMS_COMPLETED_BONUS = 25
  public constructor() {}

  /**
   * Returns sum total of points for completed user profile items
   *
   * @remarks
   * Each item for UserProfileInput is worth 10 points. There are 6
   * in total. If all are completed the user is rewarded an extra 25 points.
   * Only completed items pass through.
   *
   * @param userProfile - a UserProfileInput object
   * @param currentSumTotalPoints - how many points on a user profile
   * @returns - new sum total of points
   */
  private calculateUserProfilePoints(userProfile: IChallengeObject, currentSumTotalPoints: number) {
    const POINTS_PER_USER_PROFILE_ITEM = 10
    const MAX_COMPLETABLE_ITEMS = 6

    const completedItems = Object.keys(userProfile).length
    const itemsSumTotal = completedItems * POINTS_PER_USER_PROFILE_ITEM
    let sumTotalPoints = currentSumTotalPoints + itemsSumTotal

    if (completedItems == MAX_COMPLETABLE_ITEMS) sumTotalPoints += this.ALL_ITEMS_COMPLETED_BONUS

    return sumTotalPoints
  }

  public calculate(challengeObject: IChallengeObject, challengeType: string, currentSumTotalPoints = 0) {

    switch (challengeType) {
      case 'createProfile' || 'updateProfile':
        return this.calculateUserProfilePoints(challengeObject, currentSumTotalPoints)
      default:
        return 100
    }
  }
}