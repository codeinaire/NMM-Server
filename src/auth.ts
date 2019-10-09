require('dotenv').config({ silent: true });

import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import util from 'util';

export default class Auth {
  private client: any
  // TODO - find a better way to store jwtOptions secrets
  constructor() {
    this.client = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10, // Default value
      jwksUri: process.env.JWKS_URI || ""
    });
  }
  // TODO - fix  errors so they don't crash server
  private getToken(event: any) {
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

  private async getSigningKey(event: any) {
    const token = this.getToken(event);

    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('invalid token');
    }

    const retrieveSigningKey = util.promisify(this.client.getSigningKey);

    const { publicKey, rsaPublicKey } = await retrieveSigningKey(decoded.header.kid)

    const jwtOptions = {
      audience: process.env.AUDIENCE,
      issuer: process.env.TOKEN_ISSUER
    }

    const result: any = await jwt.verify(token, publicKey || rsaPublicKey, jwtOptions);
    console.log('RESULTS', result);

    return {
      principleId: result.sub,
      scope: result.scope
    }
  }

  public async checkScopesAndResolve(event: any, expectedScopes: [string]) {
    const result = await this.getSigningKey(event);
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

  public async checkAuthAndResolve(event: any) {
    const result = await this.getSigningKey(event);
    return result.hasOwnProperty('principleId') ? true : false;
  }
}