import { v4 as uuidv4 } from 'uuid'
import { GenReqId, Options, ReqId } from 'pino-http'
import { Params } from 'nestjs-pino'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from '../config/config.type'
import { IncomingMessage } from 'http'
import { ServerResponse } from 'http'
import {
  customErrorMessage,
  customReceivedMessage,
  customSuccessMessage
} from './messages'
import { logServiceConfig } from './providers/logging.config'
import { loggingRedactPaths } from '../shared/constants/global.constants'

const genReqId: GenReqId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const id: ReqId = req.headers['x-request-id'] || uuidv4()
  res.setHeader('X-Request-Id', id.toString())
  return id
}

async function loggerFactory(
  configService: ConfigService<AllConfigType>
): Promise<Params> {
  const appName = configService.getOrThrow('app.name', { infer: true })
  const logLevel = configService.getOrThrow('app.logLevel', { infer: true }) //'debug'
  const isDebug = configService.getOrThrow('app.debug', { infer: true }) //false
  const logService = configService.getOrThrow('app.logService', { infer: true }) //'console' //

  const pinoHttpOptions: Options = {
    name: appName,
    level: logLevel,
    genReqId: isDebug ? genReqId : undefined,
    //genReqId: (req) => req.requestId || uuid.v4(),
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
    redact: {
        paths: loggingRedactPaths,
        remove: true //censor: '**GDPR/CCPA COMPLIANT**'
      },
    ...logServiceConfig(logService)
    /*transport:
          process.env.NODE_ENV !== 'prod'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignorePaths: ['pid', 'hostname']
                }
              }
            : {
                target: 'pino/file',
                options: {
                  destination: rfs.createStream('app-%DATE%.log', {
                    interval: '1d',
                    path: './logs'
                  })
                }
              }*/
  }

  return {
    pinoHttp: pinoHttpOptions
  }
}

export default loggerFactory
