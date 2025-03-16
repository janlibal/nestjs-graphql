import { AuthConfig } from '../../auth/config/auth.config.type'
import { AppConfig } from '../../app/config/app.config.type'
import { RedisConfig } from '../../redis/config/redis.config.type'

export type AllConfigType = {
  app: AppConfig
  auth: AuthConfig
  redis: RedisConfig
}
