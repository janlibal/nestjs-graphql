import { Options } from 'pino-http'
import { LogService } from '../../shared/constants/global.constants'
import { consoleLoggingConfig } from './console.logging'
import { googleLoggingConfig } from './google.logging'
import { cloudwatchLoggingConfig } from './cloudwatch.logging'

export function logServiceConfig(logService: string): Options {
  switch (logService) {
    case LogService.GOOGLE_LOGGING:
      return googleLoggingConfig()
    case LogService.AWS_CLOUDWATCH:
      return cloudwatchLoggingConfig()
    case LogService.CONSOLE:
    default:
      return consoleLoggingConfig()
  }
}
