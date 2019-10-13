require('dotenv').config({ silent: true });

import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import util from 'util';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { IVerifiedToken, IDecodedToken, IAuth, IScopeAndId } from '../types';

export default class Auth implements IAuth {
  constructor() {}

  private async getSigningKey(keyId: string): Promise<string> {
    const client = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: process.env.JWKS_URI || ""
    });

    const retrieveSigningKey = util.promisify(client.getSigningKey);
    const retrievedKey = await retrieveSigningKey(keyId);

    return (retrievedKey as jwksClient.CertSigningKey).publicKey ||
    (retrievedKey as jwksClient.RsaSigningKey).rsaPublicKey;
  }

  private extractBearerToken(event: APIGatewayProxyEvent): string {
    const tokenString = event.headers.authorization;
    if (!tokenString) {
        throw new Error('Expected "event.headers.authorization" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }

    return match[1];
  }

  private async verifyToken(event: APIGatewayProxyEvent): Promise<IScopeAndId> {
    const token = this.extractBearerToken(event);

    const decoded: IDecodedToken = jwt.decode(token, { complete: true }) as IDecodedToken;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error('Invalid Token');
    }

    const rsaOrCertSigningKey: string = await this.getSigningKey(decoded.header.kid);

    const jwtOptions = {
      audience: process.env.AUDIENCE,
      issuer: process.env.TOKEN_ISSUER
    }
    const verifiedToken: IVerifiedToken = await jwt.verify(token, rsaOrCertSigningKey, jwtOptions) as IVerifiedToken;

    return {
      principleId: verifiedToken.sub,
      scope: verifiedToken.scope
    }
  }

  public async checkScopesAndResolve(event: APIGatewayProxyEvent, expectedScopes: [string]): Promise<boolean> {
    const result = await this.verifyToken(event);
    const scopes = result.scope;
    if (!scopes) {
      throw new Error('No scopes supplied!');
    }
    const scopesMatch = expectedScopes.some(scope => scopes.indexOf(scope) !== -1);
    if(scopesMatch) {
      return true
    } else {
      throw new Error('You are not authorized');
    }
  }

  public async checkAuthAndResolve(event: APIGatewayProxyEvent): Promise<boolean> {
    try {
      const result = await this.verifyToken(event);
      return result.hasOwnProperty('principleId') ? true : false;
    } catch (error) {
      return error;
    }
  }
}