import 'reflect-metadata'

import { container } from '../../inversify.config'
import { TYPES } from '../../inversifyTypes'
import { ICalculatePoints } from '../../types'

const calculatePoints = container.get<ICalculatePoints>(TYPES.CalculatePoints)

import {
  mockMaxUserProfileInput,
  mockMinUserProfileInput,
  mockMaxTotalPoints
} from '../../testUtils/testMocks'

describe('CalculatePoints class', () => {
  describe('For [USER PROFILE] is given [VALID] challenge type', () => {
    it('Returns - partial points for [PARTIALLY COMPLETE] user profile', () => {
      const calculatedPoints = calculatePoints.calculate(
        mockMinUserProfileInput,
        'createUserProfile'
      )

      const mockPartialTotalPoints = 40

      expect(calculatedPoints).toEqual(mockPartialTotalPoints)
    })

    it('Returns - full points for [COMPLETE] user profile', () => {
      const calculatedPoints = calculatePoints.calculate(
        mockMaxUserProfileInput,
        'createUserProfile'
      )

      expect(calculatedPoints).toEqual(mockMaxTotalPoints)
    })
  })
  // TODO - figure out why this test is failing at the throw new Error is the class
  // even though it is throwing the error.
  describe('For [USER PROFILE] is given [EMPTY] challenge type [ERROR]', () => {
    it('Returns - No challengeType provided!', () => {
      const error = calculatePoints.calculate(mockMinUserProfileInput, '')
      expect(error).toEqual('Error: No challengeType provided!')
    })
  })
})
