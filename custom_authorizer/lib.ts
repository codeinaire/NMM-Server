require('dotenv').config({ silent: true });

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const util = require('util');

import { IEvent, IDecoded, IKey } from './types';

const getPolicyDocument = (effect: string, resource: string) => {
  console.log('Effect and resource', effect, resource);

    const policyDocument = {
        Version: '2012-10-17', // default version
        Statement: [{
            Action: 'execute-api:Invoke', // default action
            Effect: effect,
            Resource: resource,
        }]
    };
    return policyDocument;
}

// extract and return the Bearer Token from the Lambda event parameters
const getToken = (event: IEvent) => {
    console.log('EVENT IN AUTHORISER', event);

    if (!event.type || event.type !== 'TOKEN') {
        throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }

    const tokenString = event.authorizationToken;
    if (!tokenString) {
        throw new Error('Expected "event.authorizationToken" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
}

const jwtOptions = {
  audience: process.env.AUDIENCE,
  issuer: process.env.TOKEN_ISSUER
};

export default (event: IEvent) => {
    const token = getToken(event);

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('invalid token');
    }

    console.log('DECODED', decoded);


    const client = jwksClient({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10, // Default value
        jwksUri: process.env.JWKS_URI
    });

    const getSigningKey = util.promisify(client.getSigningKey);

    console.log('GETSIGNINGKEY', getSigningKey);


    return getSigningKey(decoded.header.kid)
        .then((key: IKey) => {
          console.log('KEY', key);

          const signingKey = key.publicKey || key.rsaPublicKey;
          return jwt.verify(token, signingKey, jwtOptions);
        })
        .then((decoded: IDecoded) => {
          console.log('DECODED2', decoded);

          return {
            principalId: decoded.sub,
            policyDocument: getPolicyDocument('Allow', event.methodArn),
            context: { scope: decoded.scope }
        }});
}
