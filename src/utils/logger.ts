import log from 'lambda-log'
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export default (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  log.options.meta.requestContext = event.requestContext
  log.options.meta.awsRequestId = context.awsRequestId
  // TS issue https://github.com/Microsoft/TypeScript/issues/28067
  log.options.dev = process.env.DEV_LOGGING as unknown as boolean
  return log
}