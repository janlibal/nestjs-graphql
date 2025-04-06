import { registerAs } from '@nestjs/config'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min
} from 'class-validator'
import { AppConfig } from './app.config.type'

import { API_PREFIX } from '../../shared/constants/global.constants'
import * as pkginfo from '../../../package.json'
import validateConfig from '../../utils/validatate.config'

enum Environment {
  Development = 'dev',
  Production = 'prod',
  Test = 'test'
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment

  @IsInt()
  @Max(5000)
  @Min(0)
  APP_PORT: number

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string

  @IsString()
  @IsOptional()
  DATABASE_HOST: string

  @IsString()
  @IsOptional()
  API_PREFIX: string

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator)

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: pkginfo.name || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    dbUrl: process.env.DATABASE_URL || 'unknown',
    apiPrefix: API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang'
  }
})
