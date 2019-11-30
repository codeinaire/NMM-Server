import 'reflect-metadata'
import createJWKSMock from 'mock-jwks'

import { Authorisation } from '../Authorisation'
import { customMockedEvent, setUpTakeDownEnvs } from '../../testUtils'

const TOKEN_ISSUER = 'https://test-app.com/'

describe('Authorisation class', () => {
  setUpTakeDownEnvs()

  describe('[Auth.checkScopesAndResolve()] is given an event with a [VALID] Bearer authorization token & [VALID & CORRECT] scope', () => {
    it('Returned - true', async () => {
      const authorisation = new Authorisation()

      const jwksMock = createJWKSMock(TOKEN_ISSUER)
      await jwksMock.start()

      const accessToken = jwksMock.token({
        aud: ['https://test-app.com/test/'],
        iss: TOKEN_ISSUER,
        sub: 'test-user',
        scope: 'correct scope'
      })
      const mockedEvent = customMockedEvent({
        authorization: `Bearer ${accessToken}`
      })

      await expect(
        authorisation.checkScopesAndResolve(mockedEvent, ['correct', 'scope'])
      ).resolves.toEqual('test-user')
      await jwksMock.stop()
    })
  })

  describe('[Auth.checkScopesAndResolve()] ERRORS', () => {
    describe('Given an event with an [INVALID] authorisation Bearer token', () => {
      it('Returned - Error: Invalid Token', async () => {
        const authorisation = new Authorisation()
        const mockedEvent = customMockedEvent({
          authorization: 'Bearer invalid token'
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('Invalid Token'))
      })
    })

    describe('Given an event with [NO] authorisation Bearer token', () => {
      it('Returned - Expected "event.headers.authorization" parameter to be set', () => {
        const authorisation = new Authorisation()
        const mockedEvent = customMockedEvent({
          authorization: ''
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(
          new Error(
            'Expected "event.headers.authorization" parameter to be set'
          )
        )
      })
    })

    describe('Given an event with an [EMPTY] authorisation token', () => {
      it(`Returned - Invalid Authorization token - '' does not match "Bearer .*"`, () => {
        const authorisation = new Authorisation()
        const mockedEvent = customMockedEvent({
          authorization: 'Bearer'
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(
          new Error(
            'Invalid Authorization token - Bearer does not match "Bearer .*"'
          )
        )
      })
    })

    describe('Given an event with an [EMPTY] scope', () => {
      it('Returned - No scopes supplied!', async () => {
        const authorisation = new Authorisation()
        const jwksMock = createJWKSMock(TOKEN_ISSUER)
        await jwksMock.start()

        const accessToken = jwksMock.token({
          aud: ['https://test-app.com/test/'],
          iss: TOKEN_ISSUER,
          sub: 'test-user',
          scope: ''
        })
        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        })

        await expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('No scopes supplied!'))
        await jwksMock.stop()
      })
    })

    describe('Given an event with an [INCORRECT] scope', () => {
      it('Returned - You are not authorized!', async () => {
        const authorisation = new Authorisation()
        const jwksMock = createJWKSMock(TOKEN_ISSUER)
        await jwksMock.start()

        const accessToken = jwksMock.token({
          aud: ['https://test-app.com/test/'],
          iss: TOKEN_ISSUER,
          sub: 'test-user',
          scope: 'incorrect scope'
        })

        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        })

        await expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('You are not authorized!'))
        await jwksMock.stop()
      })
    })
  })
})
