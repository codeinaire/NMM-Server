import 'reflect-metadata'
import createJWKSMock from 'mock-jwks'

import { container } from '../../../inversify.config'
import { TYPES } from '../../../inversifyTypes'
import { IUserProfileAPI } from '../../../types'
import { setUpTakeDownEnvs } from '../../../testUtils'
import { Authorisation } from '../../../utils/Authorisation'
import log from '../../../utils/Logger'

// TYPES
import userProfileResolver from '../../resolvers/userProfile'
import { customMockedEvent } from '../../../testUtils'

const mockUserProfile = {
  id: 'testuserid',
  totalPoints: 100,
  challengeGoals: 5,
  motivations: 'environment,animals',
  username: 'test user',
  bio: 'default test bio',
  profilePic: 'default test profile pc'
}

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
      const mockedEvent = customMockedEvent({
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
        [mockUserProfile]
      )

      const res = await userProfileResolver.Query.me(
        null,
        { id: 'testuserid' },
        mockContext
      )

      expect(res).toEqual([mockUserProfile])
      await jwksMock.stop()
    })
  })

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
      const mockedEvent = customMockedEvent({
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
        { userProfile: mockUserProfile },
        mockContext
      )

      expect(res).toHaveProperty('updatedAt')
      expect(res).toHaveProperty('createdAt')
      expect(res).toHaveProperty('id', mockUserProfile.id)
      expect(res).toHaveProperty('username', mockUserProfile.username)
      expect(res).toHaveProperty('bio', mockUserProfile.bio)
      expect(res).toHaveProperty('challengeGoals',mockUserProfile.challengeGoals)
      expect(res).toHaveProperty('motivations', mockUserProfile.motivations)
      expect(res).toHaveProperty('profilePic', mockUserProfile.profilePic)
      expect(res).toHaveProperty('totalPoints', mockUserProfile.totalPoints)

      await jwksMock.stop()
    })
  })
})
