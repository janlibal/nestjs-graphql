import { Options } from 'pino-http'
import { Params } from 'nestjs-pino'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from '../config/config.type'
import {
  customErrorMessage,
  customReceivedMessage,
  customSuccessMessage
} from './messages'
import { logServiceConfig } from './providers/logging.config'

async function loggerFactory(
  configService: ConfigService<AllConfigType>
): Promise<Params> {
  const appName = configService.getOrThrow('app.name', { infer: true })
  const logLevel = configService.getOrThrow('app.logLevel', { infer: true })
  const isDebug = configService.getOrThrow('app.debug', { infer: true })
  const logService = configService.getOrThrow('app.logService', { infer: true })

  const pinoHttpOptions: Options = {
    name: appName,
    level: logLevel,
    serializers: isDebug
      ? {
          req: (req) => {
            req.body = req.raw.body
            return req
          }
        }
      : undefined,
    customSuccessMessage,
    customReceivedMessage,
    customErrorMessage,
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    /*redact: {
      paths: sensitiveKeys,
      remove: true 
      //censor: '**GDPR/CCPA COMPLIANT**'
    },*/
    ...logServiceConfig(logService)
  }
  return { pinoHttp: pinoHttpOptions }
}

export default loggerFactory
