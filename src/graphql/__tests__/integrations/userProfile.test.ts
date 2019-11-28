// import { createTestClient } from 'apollo-server-testing'
// import gql from 'graphql-tag'
import createJWKSMock from 'mock-jwks'
import { customMockedEvent, requestContext } from '../../../testUtils'
import { promisify } from 'util'

import { container } from '../../../inversify.config'
import { TYPES } from '../../../inversifyTypes'
import { IServer } from '../../../types'

const userProfile = {
  id: '|test|testuserid',
  challengeGoals: 5,
  motivations: 'test,motivations',
  username: 'test user'
}

// const CREATE_PROFILE = gql`
//   mutation createProfile($userProfile: UserProfileInput!) {
//     createProfile(userProfile: $userProfile) {
//       id
//       challengeGoals
//       motivations
//       username
//     }
//   }
// `
const TOKEN_ISSUER = 'https://test-app.com/'
describe('Integration - [User Profile]', () => {
  const ENVS = {
    audience: '',
    issuer: '',
    jwsUri: ''
  }
  beforeAll(() => {
    ENVS.audience = process.env.AUDIENCE || ''
    ENVS.issuer = process.env.TOKEN_ISSUER || ''
    ENVS.jwsUri = process.env.JWS_URI || ''

    process.env.JWS_URI = 'https://test-app.com/.well-known/jwks.json'
    process.env.TOKEN_ISSUER = 'https://test-app.com/'
    process.env.AUDIENCE = 'https://test-app.com/test/'
  })

  afterAll(() => {
    process.env.AUDIENCE = ENVS.audience
    process.env.TOKEN_ISSUER = ENVS.issuer
    process.env.JWS_URI = ENVS.jwsUri
  })
  it('[RESOLVER - ME] - CREATE and FIND a user profile', async () => {
    const jwksMock = createJWKSMock(TOKEN_ISSUER)
    await jwksMock.start()

    const accessToken = jwksMock.token({
      aud: ['https://test-app.com/test/'],
      iss: TOKEN_ISSUER,
      sub: 'test-user',
      scope: 'correct scope'
    })
    const mockedEvent = customMockedEvent({
      authorization: `Bearer ${accessToken}`,
      body: '{"operationName":"IntrospectionQuery","variables":{},"query":"query IntrospectionQuery {\\n  __schema {\\n    queryType {\\n      name\\n    }\\n    mutationType {\\n      name\\n    }\\n    subscriptionType {\\n      name\\n    }\\n    types {\\n      ...FullType\\n    }\\n    directives {\\n      name\\n      description\\n      locations\\n      args {\\n        ...InputValue\\n      }\\n    }\\n  }\\n}\\n\\nfragment FullType on __Type {\\n  kind\\n  name\\n  description\\n  fields(includeDeprecated: true) {\\n    name\\n    description\\n    args {\\n      ...InputValue\\n    }\\n    type {\\n      ...TypeRef\\n    }\\n    isDeprecated\\n    deprecationReason\\n  }\\n  inputFields {\\n    ...InputValue\\n  }\\n  interfaces {\\n    ...TypeRef\\n  }\\n  enumValues(includeDeprecated: true) {\\n    name\\n    description\\n    isDeprecated\\n    deprecationReason\\n  }\\n  possibleTypes {\\n    ...TypeRef\\n  }\\n}\\n\\nfragment InputValue on __InputValue {\\n  name\\n  description\\n  type {\\n    ...TypeRef\\n  }\\n  defaultValue\\n}\\n\\nfragment TypeRef on __Type {\\n  kind\\n  name\\n  ofType {\\n    kind\\n    name\\n    ofType {\\n      kind\\n      name\\n      ofType {\\n        kind\\n        name\\n        ofType {\\n          kind\\n          name\\n          ofType {\\n            kind\\n            name\\n            ofType {\\n              kind\\n              name\\n              ofType {\\n                kind\\n                name\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n"}'
    })
    const server = container.get<IServer>(TYPES.Server)
    const lambda = server.getApolloInstance().createHandler()

    // const { mutate } = createTestClient(lambda(mockedEvent, requestContext, (error, results) => results)
    // const res = await mutate({
    //   mutation: CREATE_PROFILE,
    //   variables: {
    //     userProfile
    //   }
    // })
    console.log(userProfile);

    const handler = promisify(lambda)
    const result = handler(mockedEvent, requestContext)
    result.then(data => {
      console.log('data test', data);
    }).catch(e => {
      console.log('error', e);

    })

    // console.log('res', res.http!.headers)

    // expect(res.data!.userProfile).toEqual([userProfile])
  })
})

describe('Mutations', () => {})
