export interface IEvent {
  authorizationToken: string;
  type: string;
  methodArn: string;
  enhancedAuthContext: any;
  requestContext: {
    accountId: string;
    apiId: string;
    httpMethod: string;
    requestId: string;
    resourceId: string;
    resourcePath: string;
    stage: string;
  }
}

export interface IDecoded {
  iss: string;
  sub: string;
  aud: [string];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
}

export interface IKey {
  kid: string;
  nbf: any;
  publicKey?: string;
  rsaPublicKey?: string;
}