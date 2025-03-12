import { NestFactory } from '@nestjs/core'
import { GlobalModule } from './global/global.module'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from './config/config/config.type'
import { API_PREFIX } from './shared/constants/global.constants'
import { ValidationPipe } from '@nestjs/common'
import { PinoLoggerService } from './logger/adapters/pino.logger.service'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { useContainer } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create(GlobalModule)
  const logger = app.get(PinoLoggerService)
  logger.setContext('main')
  app.useLogger(logger)

  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // Automatically transform the input into DTO instances
    whitelist: true,  // Strip properties not in the DTO
    forbidNonWhitelisted: true,  // Throw an error if non-whitelisted properties are found
  }));

  // Register the custom exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // enable shutdown hook
  app.enableShutdownHooks()

  // Enable global validation pipes with transformation
  useContainer(app.select(GlobalModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService<AllConfigType>)

  app.setGlobalPrefix(API_PREFIX)

  const port = configService.getOrThrow('app.port', { infer: true })
  const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true })
  const pkgInfo = configService.getOrThrow('app.name', { infer: true })
  const dbUrl = configService.getOrThrow('app.dbUrl', { infer: true })
  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true })

  app.enableCors()

  await app.listen(port, async () => {
    console.log(`Port: ${port}`)
    console.log(`NodeEnv: ${nodeEnv}`)
    console.log(`pkgInfo: ${pkgInfo}`)
    console.log(`dbUrl: ${dbUrl}`)
    console.log(`apiPrefix: ${apiPrefix}`)
    console.log(`Server started on ${port}`)
    logger.log(`App started on port ${port}!`)
  })
}

bootstrap()
