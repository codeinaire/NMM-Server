import 'reflect-metadata'
import createJWKSMock from 'mock-jwks'

import { container } from '../../../inversify.config'
import { TYPES } from '../../../inversifyTypes'
import { IUserProfileAPI } from '../../../types'
import { setUpTakeDownEnvs } from '../../../testUtils/testEnvsSetup'
import { Authorisation } from '../../../utils/Authorisation'
import log from '../../../utils/Logger'
// TYPES
import userProfileResolver from '../../resolvers/userProfile'
import { mockCustomEvent, mockCompleteUserProfileInput, mockMaxTotalPoints } from '../../../testUtils/testMocks'

const TOKEN_ISSUER = 'https://test-app.com/'

describe('Resolvers - [UserProfile]', () => {
  setUpTakeDownEnvs()

  describe('Query', () => {
    it('[ME] Returned - user profile', async () => {
      const jwksMock = createJWKSMock(TOKEN_ISSUER)
      await jwksMock.start()

      const accessToken = jwksMock.token({
        aud: ['https://test-app.com/test/'],
        iss: TOKEN_ISSUER,
        sub: 'testuserid',
        scope: 'profile'
      })
      const mockedEvent = mockCustomEvent({
        authorization: `Bearer ${accessToken}`
      })

      const mockContext = {
        dataSources: {
          userProfileAPI: { findUserProfile: jest.fn() }
        },
        event: mockedEvent,
        log: new log().getLogger(),
        auth: new Authorisation()
      }

      mockContext.dataSources.userProfileAPI.findUserProfile.mockReturnValueOnce(
        [mockCompleteUserProfileInput]
      )

      const res = await userProfileResolver.Query.me(
        null,
        { id: 'testuserid' },
        mockContext
      )

      expect(res).toEqual([mockCompleteUserProfileInput])
      await jwksMock.stop()
    })
  })

  // * N.B. This needs Test DB connection to pass * \\
  describe('Mutation', () => {
    const userProfileAPI = container.get<IUserProfileAPI>(TYPES.UserProfileAPI)
    afterEach(() => {
      userProfileAPI.closeDbConnection()
    })
    it('[CREATE PROFILE] Returned - user profile', async () => {
      const jwksMock = createJWKSMock(TOKEN_ISSUER)
      await jwksMock.start()

      const accessToken = jwksMock.token({
        aud: ['https://test-app.com/test/'],
        iss: TOKEN_ISSUER,
        sub: 'testuserid',
        scope: 'profile'
      })
      const mockedEvent = mockCustomEvent({
        authorization: `Bearer ${accessToken}`
      })

      await userProfileAPI.initialize({
        context: jest.fn(),
        cache: {
          get: jest.fn(),
          set: jest.fn(),
          delete: jest.fn()
        }
      })

      const mockContext = {
        dataSources: {
          userProfileAPI
        },
        event: mockedEvent,
        log: new log().getLogger(),
        auth: new Authorisation()
      }

      const res = await userProfileResolver.Mutation.createProfile(
        null,
        { userProfile: mockCompleteUserProfileInput },
        mockContext
      )

      expect(res).toHaveProperty('updatedAt')
      expect(res).toHaveProperty('createdAt')
      expect(res).toHaveProperty('id', mockCompleteUserProfileInput.id)
      expect(res).toHaveProperty('username', mockCompleteUserProfileInput.username)
      expect(res).toHaveProperty('bio', mockCompleteUserProfileInput.bio)
      expect(res).toHaveProperty('challengeGoals',mockCompleteUserProfileInput.challengeGoals)
      expect(res).toHaveProperty('motivations', mockCompleteUserProfileInput.motivations)
      expect(res).toHaveProperty('profilePic', mockCompleteUserProfileInput.profilePic)
      expect(res).toHaveProperty('totalPoints', mockMaxTotalPoints )

      await jwksMock.stop()
    })
  })
})
