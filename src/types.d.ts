import { APIGatewayProxyEvent } from 'aws-lambda';

export interface IVerifiedToken {
  iss: string
  sub: string
  aud: [string]
  iat: number
  exp: number
  azp: string
  scope: string
}

export interface IDecodedToken {
  header: {
    typ: string
    alg: string
    kid: string
  }
  payload: {
    iss: string
    sub: string
    aud: [string]
    iat: number
    exp: number
    azp: string
    scope: string
  }
  signature: string
}

export interface IScopeAndId {
  principleId: string
  scopes: Array<string>
}

export interface IAuth {
  checkScopesAndResolve: (
    arg0: APIGatewayProxyEvent,
    arg1: Array<string>,
  ) => Promise<string>
}

export interface IModifiedObject {
  [name: string]: string
}