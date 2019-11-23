import { injectable } from 'inversify'
import log from 'lambda-log'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ILogger } from '../types'

// N.B. Overkill with class, but want to practice with classes in this project
@injectable()
export class Logger implements ILogger {
  private log: any

  public constructor() {
    this.log = log
  }

  createContext(event: APIGatewayProxyEvent, context: Context) {
    this.log.options.meta.requestContext = event.requestContext
    this.log.options.meta.awsRequestId = context.awsRequestId
    // TS issue https://github.com/Microsoft/TypeScript/issues/28067
    this.log.options.dev = (process.env.DEV_LOGGING as unknown) as boolean
  }

  getLogger() {
    return this.log
  }
}
