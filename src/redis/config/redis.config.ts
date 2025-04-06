import { registerAs } from '@nestjs/config'

import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

import validateConfig from '../../utils/validatate.config'

import { RedisConfig } from './redis.config.type'

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_PORT: number

  @IsString()
  @IsOptional()
  REDIS_HOST: string

  @IsString()
  @IsOptional()
  REDIS_USERNAME: string

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_DB: number

  @IsInt()
  @Min(0)
  @Max(900000)
  @IsOptional()
  REDIS_EXPIRY: number

  //REDIS_PORT=+6379
  //REDIS_HOST=127.0.0.1
  //REDIS_USERNAME=default
  //REDIS_PASSWORD=root
  //REDIS_DB=1

  //redisUrl: string
  //username: string
  //password: string
  //port: number
  //dbNumber: number
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator)

  return {
    redisUrl: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    dbNumber: process.env.REDIS_DB
      ? parseInt(process.env.REDIS_DB, 10)
      : process.env.REDIS_DB
        ? parseInt(process.env.REDIS_DB, 10)
        : 1,
    port: process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT, 10)
      : process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT, 10)
        : +6379,
    expiry: process.env.REDIS_EXPIRY
      ? parseInt(process.env.REDIS_EXPIRY, 10)
      : process.env.REDIS_EXPIRY
        ? parseInt(process.env.REDIS_EXPIRY, 10)
        : 900000
    //expiry: process.env.REDIS_EXPIRY,
  }
})
