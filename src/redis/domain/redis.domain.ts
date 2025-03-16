import { User } from '../../users/model/user.model'
import { RedisPrefixEnum } from '../enums/redis.prefix.enum'

export class RedisDomain {
  prefix: RedisPrefixEnum
  user: User
  token: string
  expiry: number
}
