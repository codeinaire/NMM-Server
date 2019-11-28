import 'reflect-metadata'
import createJWKSMock from 'mock-jwks'
import { Authorisation } from '../../../utils/Authorisation'
import log from '../../../utils/logger'

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
  // const ENVS = {
  //   audience: '',
  //   issuer: '',
  //   jwsUri: ''
  // }
  // beforeAll(() => {
  //   ENVS.audience = process.env.AUDIENCE || ''
  //   ENVS.issuer = process.env.TOKEN_ISSUER || ''
  //   ENVS.jwsUri = process.env.JWS_URI || ''

  //   process.env.JWS_URI = 'https://test-app.com/.well-known/jwks.json'
  //   process.env.TOKEN_ISSUER = 'https://test-app.com/'
  //   process.env.AUDIENCE = 'https://test-app.com/test/'
  // })

  // afterAll(() => {
  //   process.env.AUDIENCE = ENVS.audience
  //   process.env.TOKEN_ISSUER = ENVS.issuer
  //   process.env.JWS_URI = ENVS.jwsUri
  // })

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
})
