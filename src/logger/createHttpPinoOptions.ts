import { GenReqId, Options } from 'pino-http'
import { randomUUID } from 'crypto'
import { IncomingMessage, ServerResponse } from 'http'
import { ConfigService } from '@nestjs/config'

const genReqId: GenReqId = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const id = req.headers['x-request-id'] || randomUUID()
  req.id = id
  res.setHeader('x-request-id', id)
  return id
}

export function createPinoHttpOptions(
  configService: ConfigService
): Options<IncomingMessage, ServerResponse> {
  return {
    level: configService.get('app.logLevel', { infer: true }) || 'debug',
    genReqId: genReqId,
    customProps: (req) => ({
      requestId: req.id
    }),
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`
  }
}
