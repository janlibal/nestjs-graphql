import { Global, Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { PinoLoggerService } from './adapters/pino.logger.service'
import loggerFactory from './logger.factory'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: loggerFactory
    })
  ],
  providers: [PinoLoggerService],
  exports: [PinoLoggerService]
})
export class LoggerModule {}
