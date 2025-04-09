import { Options } from 'pino-http'
import { LogService } from 'src/shared/constants/global.constants'
import { consoleLoggingConfig } from './console.logging'

export function logServiceConfig(logService: string): Options {
  switch (logService) {
    case LogService.CONSOLE:
    default:
      return consoleLoggingConfig()
  }
}
