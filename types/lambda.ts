const { APIGatewayEventRequestContext } = require('@types/aws-lambda');

export interface IRequestContext extends APIGatewayEventRequestContext {
  authorizer: {
    scope: string;
    principalId: string;
    integrationLatency: number;
  }
}