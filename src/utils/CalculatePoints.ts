import { injectable } from "inversify"
import { ICalculatePoints, IChallengeObject } from '../types'

@injectable()
export default class CalculatePoints implements ICalculatePoints {
  private readonly USER_PROFILE_POINTS_PER_ITEM = 10
  public constructor() {

  }

  private calculateUserProfilePoints(challengeObject: IChallengeObject) {
    // TODO - TSDoc this
    // Only completed items will be passed through therefore will calculate the total of included items, will not calculate items in relation to how many can be completed.
    const completedItems = Object.keys(challengeObject).length
    const sumTotalPoints = completedItems * this.USER_PROFILE_POINTS_PER_ITEM
    return sumTotalPoints
  }

  public calculate(challengeObject: IChallengeObject, challengeType: string) {
    console.log('in calculate', challengeObject, challengeType);

    switch (challengeType) {
      case 'createProfile':
        return this.calculateUserProfilePoints(challengeObject)
      default:
        return 100
    }
  }
}