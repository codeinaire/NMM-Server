import 'reflect-metadata'
import CalculatePoints from '../CalculatePoints'
import {
  mockCompleteUserProfileInput,
  mockPartialUserProfileInput,
  mockMaxTotalPoints
} from '../../testUtils/testMocks'

describe('CalculatePoints class', () => {
  describe('For [USER PROFILE] is given [VALID] challenge type', () => {
    it('Returns - partial points for [PARTIALLY COMPLETE] user profile', () => {
      const calculatePoints = new CalculatePoints()

      const calculatedPoints = calculatePoints.calculate(
        mockPartialUserProfileInput,
        'createUserProfile'
      )

      const mockPartialTotalPoints = 40

      expect(calculatedPoints).toEqual(mockPartialTotalPoints)
    })

    it('Returns - full points for [COMPLETE] user profile', () => {
      const calculatePoints = new CalculatePoints()

      const calculatedPoints = calculatePoints.calculate(
        mockCompleteUserProfileInput,
        'createUserProfile'
      )

      expect(calculatedPoints).toEqual(mockMaxTotalPoints)
    })
  })
  // TODO - figure out why this test is failing at the throw new Error is the class
  // even though it is throwing the error.
  describe('For [USER PROFILE] is given [EMPTY] challenge type [ERROR]', () => {
    it('Returns - No challengeType provided!', () => {
      const calculatePoints = new CalculatePoints()
      const error = calculatePoints.calculate(mockPartialUserProfileInput, '')
      expect(
        error
      ).toEqual('Error: No challengeType provided!')
    })
  })
})
