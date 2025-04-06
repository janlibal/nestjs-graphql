import { NestFactory } from '@nestjs/core'
import { GlobalModule } from './global/global.module'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from './config/config/config.type'
import { API_PREFIX } from './shared/constants/global.constants'
import { PinoLoggerService } from './logger/adapters/pino.logger.service'
import { ValidationPipe } from '@nestjs/common'
import validationOptions from './utils/validation.options'
import { GraphQLExceptionFilter } from './filters/graphql.filter'
import * as fs from 'fs'
import { GraphqlLoggingInterceptor } from './interceptors/graphql-logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(GlobalModule)

  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
  }

  const logger = app.get(PinoLoggerService)

  app.useGlobalInterceptors(new GraphqlLoggingInterceptor(logger))

  logger.setContext('main')
  app.useLogger(logger)

  app.useGlobalFilters(new GraphQLExceptionFilter())

  app.useGlobalPipes(new ValidationPipe(validationOptions))

  app.enableShutdownHooks()

  const configService = app.get(ConfigService<AllConfigType>)

  app.setGlobalPrefix(API_PREFIX)

  const port = configService.getOrThrow('app.port', { infer: true })
  const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true })
  const pkgInfo = configService.getOrThrow('app.name', { infer: true })
  const dbUrl = configService.getOrThrow('app.dbUrl', { infer: true })
  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true })

  const workingDirectory = configService.getOrThrow('app.workingDirectory', {
    infer: true
  })
  const frontendDomain = configService.getOrThrow('app.frontendDomain', {
    infer: true
  })
  const backendDomain = configService.getOrThrow('app.backendDomain', {
    infer: true
  })
  const fallbackLanguage = configService.getOrThrow('app.fallbackLanguage', {
    infer: true
  })
  const headerLanguage = configService.getOrThrow('app.headerLanguage', {
    infer: true
  })

  const secret = configService.getOrThrow('auth.secret', { infer: true })
  const expires = configService.getOrThrow('auth.expires', { infer: true })
  const refreshSecret = configService.getOrThrow('auth.refreshSecret', {
    infer: true
  })
  const refreshExpires = configService.getOrThrow('auth.refreshExpires', {
    infer: true
  })
  const forgotSecret = configService.getOrThrow('auth.forgotSecret', {
    infer: true
  })
  const forgotExpires = configService.getOrThrow('auth.forgotExpires', {
    infer: true
  })
  const confirmEmailSecret = configService.getOrThrow(
    'auth.confirmEmailSecret',
    { infer: true }
  )
  const confirmEmailExpires = configService.getOrThrow(
    'auth.confirmEmailExpires',
    { infer: true }
  )

  app.enableCors()

  await app.listen(port, async () => {
    console.log(`1. Port: ${port}`)
    console.log(`2. NodeEnv: ${nodeEnv}`)
    console.log(`3. pkgInfo: ${pkgInfo}`)
    console.log(`4. dbUrl: ${dbUrl}`)
    console.log(`5. apiPrefix: ${apiPrefix}`)
    console.log(`6. Working directory: ${workingDirectory}`)
    console.log(`7. Frontend domain: ${frontendDomain}`)
    console.log(`8. Backend domain: ${backendDomain}`)
    console.log(`9. Fallback language: ${fallbackLanguage}`)
    console.log(`10. Header language: ${headerLanguage}`)

    console.log(`12. Secret: ${secret}`)
    console.log(`13. Expires: ${expires}`)
    console.log(`14. Refresh secret: ${refreshSecret}`)
    console.log(`15. Refresh expires: ${refreshExpires}`)
    console.log(`16. Forgot secret: ${forgotSecret}`)
    console.log(`17. Forgot expires: ${forgotExpires}`)
    console.log(`18. Confirm email secret: ${confirmEmailSecret}`)
    console.log(`19. Confirm email expires: ${confirmEmailExpires}`)

    logger.log(`App started on port: ${port}!`)
  })
}

bootstrap()
