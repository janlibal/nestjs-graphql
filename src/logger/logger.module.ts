import { Global, Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { PinoLoggerService } from './adapters/pino.logger.service'
import loggerFactory from './logger.factory'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: loggerFactory
    })
  ],
  providers: [PinoLoggerService],
  exports: [PinoLoggerService]
})
export class LoggerModule {}
