import { FactoryProvider, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { redisStatus } from './redis.status'

import { ConfigService } from '@nestjs/config'
import { AllConfigType } from 'src/config/config/config.type'

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (configService: ConfigService<AllConfigType>) => {
    const redisInstance = new Redis({
      host: configService.getOrThrow('redis.redisUrl', { infer: true }), //'127.0.0.1',
      username: configService.getOrThrow('redis.username', { infer: true }), //'default',
      password: configService.getOrThrow('redis.password', { infer: true }), //'root',
      db: configService.getOrThrow('redis.dbNumber', { infer: true }), //1,
      port: configService.getOrThrow('redis.port', { infer: true }), //+6379,
    })

    redisInstance.on('connect', redisStatus.handleConnect.bind(this))
    redisInstance.on('ready', redisStatus.handleReady.bind(this))
    redisInstance.on('error', redisStatus.handleError.bind(this))
    redisInstance.on('close', redisStatus.handleClose.bind(this))
    redisInstance.on('reconnecting', redisStatus.handleReconnecting.bind(this))
    redisInstance.on('end', redisStatus.handleEnd.bind(this))

    return redisInstance
  },
  inject: [ConfigService],
}
