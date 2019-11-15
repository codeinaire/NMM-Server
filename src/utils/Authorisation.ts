import jwksClient, { JwksClient } from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import util from 'util'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { IVerifiedToken, IDecodedToken, IScopeAndId } from '../types'

export class Authorisation {
  private client: JwksClient
  private audience: string
  private issuer: string

  constructor() {
    this.client = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: process.env.JWS_URI || ''
    })
    this.audience = process.env.AUDIENCE || ''
    this.issuer = process.env.TOKEN_ISSUER || ''
  }

  private async getSigningKey(keyId: string): Promise<string> {
    const retrieveSigningKey = util.promisify(this.client.getSigningKey)

    const retrievedKey = await retrieveSigningKey(keyId)

    return (
      (retrievedKey as jwksClient.CertSigningKey).publicKey ||
      (retrievedKey as jwksClient.RsaSigningKey).rsaPublicKey
    )
  }

  private extractBearerToken(event: APIGatewayProxyEvent): string {
    const tokenString = event.headers.authorization
    if (!tokenString) {
      throw new Error(
        'Expected "event.headers.authorization" parameter to be set'
      )
    }

    const match = tokenString.match(/^Bearer (.*)$/)
    if (!match || match.length < 2) {
      throw new Error(
        `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`
      )
    }

    return match[1]
  }

  private async verifyToken (
    event: APIGatewayProxyEvent
  ): Promise<IScopeAndId> {
    const token = this.extractBearerToken(event)

    const decoded: IDecodedToken = jwt.decode(token, {
      complete: true
    }) as IDecodedToken
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error('Invalid Token')
    }

    const rsaOrCertSigningKey: string = await this.getSigningKey(decoded.header.kid)

    const jwtOptions = {
      audience: this.audience,
      issuer: this.issuer
    }
    const verifiedToken: IVerifiedToken = (await jwt.verify(
      token,
      rsaOrCertSigningKey,
      jwtOptions
    )) as IVerifiedToken

    const scopes: Array<string> = verifiedToken.scope.split(' ')

    return {
      principleId: verifiedToken.sub,
      scopes: scopes
    }
  }

  public async checkScopesAndResolve(
    event: APIGatewayProxyEvent,
    expectedScopes: Array<string>
  ): Promise<boolean> {
    const verifiedToken = await this.verifyToken(event)

    const scopes: Array<string> = verifiedToken.scopes

    const NO_SCOPES = 0
    if (scopes[0].length == NO_SCOPES) {
      throw new Error('No scopes supplied!')
    }

    const scopesMatch = expectedScopes.some(
      scope => scopes.indexOf(scope) !== -1
    )

    if (scopesMatch) {
      return true
    } else {
      throw new Error('You are not authorized!')
    }
  }
}

const authorisation = new Authorisation()
Object.freeze(authorisation)

export default authorisation
