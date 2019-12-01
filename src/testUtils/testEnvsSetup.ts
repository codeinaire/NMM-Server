import { IEnvs } from '../types'

declare var process : {
  env: {
    SILENT_LOGGING: boolean
    JWS_URI: string
    TOKEN_ISSUER: string
    AUDIENCE: string
  }
}

export function setUpTakeDownEnvs(): void {
  const ENVS: IEnvs = {
    audience: '',
    issuer: '',
    jwsUri: '',
    silentLogger: false
  }
  beforeAll(() => {
    ENVS.audience = process.env.AUDIENCE!
    ENVS.issuer = process.env.TOKEN_ISSUER!
    ENVS.jwsUri = process.env.JWS_URI!
    ENVS.silentLogger = (process.env.SILENT_LOGGING as unknown) as boolean

    process.env.JWS_URI = 'https://test-app.com/.well-known/jwks.json'
    process.env.TOKEN_ISSUER = 'https://test-app.com/'
    process.env.AUDIENCE = 'https://test-app.com/test/'
    process.env.SILENT_LOGGING = true
  })

  afterAll(() => {
    process.env.AUDIENCE = ENVS.audience
    process.env.TOKEN_ISSUER = ENVS.issuer
    process.env.JWS_URI = ENVS.jwsUri
    process.env.SILENT_LOGGING = ENVS.silentLogger
  })
}