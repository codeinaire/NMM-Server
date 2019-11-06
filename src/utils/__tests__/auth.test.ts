import createJWKSMock from 'mock-jwks';
import Auth from '../auth';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { IModifiedObject } from '../../types';

describe('Authentication and Authorization class', () => {
  describe('[Auth.checkScopesAndResolve()] is given an event with a [VALID] Bearer authorization token & [VALID & CORRECT] scope', () => {
    xit('Returned - true', async () => {
      process.env.JWKS_URI = 'https://test-app.com/.well-known/jwks.json';
      process.env.TOKEN_ISSUER = 'https://test-app.com/';
      process.env.AUDIENCE = 'https://test-app.com/test/';
      // TODO - fix the createJWKSMock test
      const jwksMock = createJWKSMock('https://test-app.com/');
      jwksMock.start();
      const accessToken = jwksMock.token({
        aud: [
          'https://test-app.com/test/'
        ],
        iss: 'https://test-app.com/',
        sub: 'test-user',
        scope: 'test scope'
      })
      const mockedEvent = customMockedEvent({
        authorization: `Bearer ${accessToken}`
      });

      const authInstance = new Auth();
      const authCheck = authInstance.checkScopesAndResolve(mockedEvent, ['test scope']);

      expect(authCheck).resolves.toBe(true);
      await jwksMock.stop();
    })
  })

  describe('[Auth.checkScopesAndResolve()] ERRORS', () => {
    describe('Given an event with an [INVALID] authorization Bearer token', () => {
      it('Returned - Error: Invalid Token', async () => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: 'Bearer invalid token'
        });

        expect(authInstance.checkScopesAndResolve(mockedEvent, ['test scope'])).resolves.toThrow('Error: Invalid Token');
      })
    })

    describe('Given an event with [NO] authorization Bearer token', () => {
      it('Returned - Expected "event.headers.authorization" parameter to be set', () => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: ''
        });

        expect(authInstance.checkScopesAndResolve(mockedEvent, ['test scope'])).resolves.toThrow('Error: Expected "event.headers.authorization" parameter to be set');
      })
    })

    describe('Given an event with an [EMPTY] authorization token', () => {
      it(`Returned - Invalid Authorization token - '' does not match "Bearer .*"`, () => {
        const authInstance = new Auth();

        const mockedEvent = customMockedEvent({
          authorization: 'Bearer'
        });

        expect(authInstance.checkScopesAndResolve(mockedEvent, ['test scope'])).resolves.toThrow(`Error: Invalid Authorization token - Bearer does not match "Bearer .*"`);
      })
    })

    describe('Given an event with an [EMPTY] scope', () => {
      it('Returned - No scopes supplied!', async () => {
        const jwksMock = await createJwksContext()
        const accessToken = jwksMock.token({
          aud: [
            'https://test-app.com/test/'
          ],
          iss: 'https://test-app.com/',
          sub: 'test-user',
          scope: 'incorrect scope'
        })
        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        });

        const authInstance = new Auth();

        expect(authInstance.checkScopesAndResolve(mockedEvent, ['test scope'])).resolves.toThrow('Error: No scopes supplied!');
        jwksMock.stop();
      })
    })

    describe('Given an event with an [INCORRECT] scope', () => {
      xit('Returned - You are not authorized!', async () => {
        // const jwksMock = await createJwksContext();
        process.env.JWKS_URI = 'https://test-app.com/.well-known/jwks.json';
        process.env.TOKEN_ISSUER = 'https://test-app.com/';
        process.env.AUDIENCE = 'https://test-app.com/test/';
        const jwksMock = createJWKSMock('https://test-app.com/');
        await jwksMock.start();
        const accessToken = jwksMock.token({
          aud: [
            'https://test-app.com/test/'
          ],
          iss: 'https://test-app.com/',
          sub: 'test-user',
          scope: 'incorrect scope'
        })
        console.log('accessToken', accessToken);


        const mockedEvent = customMockedEvent({
          authorization: `Bearer ${accessToken}`
        });

        const authInstance = new Auth();

        expect(authInstance.checkScopesAndResolve(mockedEvent, ['incorrect scope'])).resolves.toThrow('Error: You are not authorized!');
        await jwksMock.stop();
      })
    })
  })
})

function createJwksContext(): any {
  // process.env.JWKS_URI = 'https://test-app.com/.well-known/jwks.json';
  // process.env.TOKEN_ISSUER = 'https://test-app.com/';
  // process.env.AUDIENCE = 'https://test-app.com/test/';

  const jwksMock = createJWKSMock('test');

  return jwksMock;
}


function customMockedEvent(modificationObject: IModifiedObject): APIGatewayProxyEvent {
  return {
    body: '{"body": "mock body"}',
    headers: {
      mockHeaders: 'mock header',
      authorization: `${modificationObject.authorization}`,
    },
    httpMethod: 'POST',
    multiValueHeaders: {
      authorization: [
        'invalid token'
      ]
    },
    isBase64Encoded: false,
    multiValueQueryStringParameters: null,
    path: '/nmm-app',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {
      accountId: 'offlineContext_accountId',
      apiId: 'offlineContext_apiId',
      authorizer: {
        principalId: 'offlineContext_authorizer_principalId',
        claims: [Object]
      },
      httpMethod: 'POST',
      identity: {
        accessKey: 'test string',
        accountId: 'test string',
        apiKey: 'test string',
        apiKeyId: 'test string',
        caller: 'test string',
        cognitoAuthenticationProvider: 'test string',
        cognitoAuthenticationType: 'test string',
        cognitoIdentityId: 'test string',
        cognitoIdentityPoolId: 'test string',
        sourceIp: 'test string',
        user: 'test string',
        userAgent: 'test string',
        userArn: 'test string',
      },
      path: 'test path',
      requestId: 'offlineContext_requestId_ck1lg5mc8000j3aeh0hjq82sm',
      requestTimeEpoch: 1570756990015,
      resourceId: 'offlineContext_resourceId',
      resourcePath: '/nmm-app',
      stage: 'dev'
    },
    resource: '/nmm-app',
    stageVariables: null
  }
}