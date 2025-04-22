import { NestFactory } from '@nestjs/core'
import { GlobalModule } from './global/global.module'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from './config/config.type'
import { API_PREFIX } from './shared/constants/global.constants'
import { PinoLoggerService } from './logger/adapters/pino.logger.service'
import { ValidationPipe } from '@nestjs/common'
import validationOptions from './utils/validation.options'
import { GraphQLExceptionFilter } from './filters/graphql.filter'
import * as fs from 'fs'
import { GraphqlLoggingInterceptor } from './interceptors/graphql-logging.interceptor'
import { createPinoHttpOptions } from './logger/createHttpPinoOptions'
import pinoHttp from 'pino-http'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import compression from 'compression'

async function bootstrap() {
  try {
    const app = await NestFactory.create(GlobalModule, { bufferLogs: true })

    // Make sure './logs' folder exists, and if not, create one
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs')
    }

    const configService = app.get(ConfigService<AllConfigType>)

    app.enableShutdownHooks()

    const logger = app.get(PinoLoggerService)
    // 1. Set up the logger globally
    app.useLogger(logger) // Use logger for general application logging

    // 2. Set up PinoHttp for logging HTTP requests/responses
    const loggerOptions = createPinoHttpOptions(configService) // Create options for pino-http
    app.use(pinoHttp(loggerOptions)) // Middleware to log HTTP requests

    // 3. Optionally set context for the logger (for example, setting the app context)
    logger.setContext('main') // Set a specific context for the main application

    // 4. Use GraphQL logging interceptor to log GraphQL-specific operations
    app.useGlobalInterceptors(new GraphqlLoggingInterceptor(logger)) // Interceptor for GraphQL logging

    app.useGlobalFilters(new GraphQLExceptionFilter())

    app.useGlobalPipes(new ValidationPipe(validationOptions))

    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            upgradeInsecureRequests: null
          }
        }
      })
    )

    app.use(compression())

    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      })
    )

    app.use(cookieParser())

    app.setGlobalPrefix(API_PREFIX)

    const port = configService.getOrThrow('app.port', { infer: true })
    /*const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true })
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
    const confirmEmailSecret = configService.getOrThrow('auth.confirmEmailSecret', { infer: true })
    const confirmEmailExpires = configService.getOrThrow('auth.confirmEmailExpires', {
      infer: true
    })

    const appName = configService.getOrThrow('app.name', { infer: true })
    const logLevel = configService.getOrThrow('app.logLevel', { infer: true })
    const logService = configService.getOrThrow('app.logService', {
      infer: true
    })
    const isDebug = configService.getOrThrow('app.debug', { infer: true })*/

    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true
    })

    await app.listen(port, async () => {
      /*console.log(`1. Port: ${port}`)
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

      console.log(`20. appName: ${appName}`)
      console.log(`21. logLevel: ${logLevel}`)
      console.log(`22. logService: ${logService}`)
      console.log(`23. isDebug?: ${isDebug}`)*/

      logger.log(`App started on port: ${port}`)
    })
  } catch (error) {
    console.log(`Error occurred while starting server ${error}`)
  }
}
bootstrap().catch((e) => {
  console.log(`Error while starting server ${e}`)
  throw e
})
