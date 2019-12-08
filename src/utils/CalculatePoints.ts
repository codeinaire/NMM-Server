import { inject, injectable } from "inversify"
import { TYPES } from '../inversifyTypes'

import { LambdaLog } from 'lambda-log'
import { ILogger } from '../types'
import { ICalculatePoints, IChallengeObject } from '../types'

@injectable()
export default class CalculatePoints implements ICalculatePoints {
  private readonly logger: LambdaLog

  private readonly ALL_ITEMS_COMPLETED_BONUS = 25
  public constructor(@inject(TYPES.Logger) Logger: ILogger) {
    this.logger = Logger.getLogger()
  }

  /**
   * Returns sum total of points for completed user profile items
   *
   * @remarks
   * Each item for UserProfileInput is worth 10 points. There are 7
   * in total. If all are completed the user is rewarded an extra 25 points.
   * Only completed items pass through. Which is why I'm not using
   * default value for the arguments of the userProfile class.
   *
   * @param userProfile - a UserProfileInput object
   * @param currentSumTotalPoints - how many points on a user profile
   * @returns - new sum total of points
   */
  private calculateUserProfilePoints(userProfile: IChallengeObject, currentSumTotalPoints: number) {
    const POINTS_PER_USER_PROFILE_ITEM = 10
    const MAX_COMPLETABLE_ITEMS = 7

    const completedItems = Object.keys(userProfile).length
    const itemsSumTotal = completedItems * POINTS_PER_USER_PROFILE_ITEM
    let sumTotalPoints = currentSumTotalPoints + itemsSumTotal

    if (completedItems == MAX_COMPLETABLE_ITEMS) sumTotalPoints += this.ALL_ITEMS_COMPLETED_BONUS

    return sumTotalPoints
  }

  public calculate(challengeObject: IChallengeObject, challengeType: string, currentSumTotalPoints = 0) {
    if (!challengeType) throw new Error('No challengeType provided!')

    switch (challengeType) {
      case 'createUserProfile' || 'updateProfile':
        console.log('challengeObject', challengeObject);

        this.logger.info(`Calculating points for user profile items: ${JSON.stringify(challengeObject)}`)
        const sumTotalPoints = this.calculateUserProfilePoints(challengeObject, currentSumTotalPoints)
        this.logger.info(`Calculated points: ${sumTotalPoints}`)
        return sumTotalPoints
      default:
        return 100
    }
  }
}