import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from 'aws-lambda';

export interface IRequestContext extends APIGatewayEventRequestContext {
  authorizer: {
    scope: string;
    principalId: string;
    integrationLatency: number;
  }
}

export interface IAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  requestContext: IRequestContext
}