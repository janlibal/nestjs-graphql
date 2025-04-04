import { Global, Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import * as uuid from 'uuid'
import { FakeLoggerService } from './adapters/fake.logger.service'
import { PinoLoggerService } from './adapters/pino.logger.service'
import * as rfs from 'rotating-file-stream';

declare module 'http' {
  interface IncomingMessage {
    requestId: string
  }
}

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        name: 'backend',
        level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
        genReqId: (req) => req.requestId || uuid.v4(),
        transport: process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignorePaths: ['pid', 'hostname'],
              },
            }
          : {
              target: 'pino/file',
              options: {
                destination: rfs.createStream('app-%DATE%.log', {
                  interval: '1d', 
                  path: './logs', 
                }),
              },
            },
      },
    }),
  ],
  providers: [PinoLoggerService, FakeLoggerService],
  exports: [PinoLoggerService, FakeLoggerService],
})
export class LoggerModule {}
