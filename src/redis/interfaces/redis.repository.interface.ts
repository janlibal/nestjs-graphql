import { RedisDomain } from '../domain/redis.domain'

export interface RedisRepositoryInterface {
  get(prefix: string, key: string): Promise<string | null>
  delete(prefix: string, key: string): Promise<void>
  createUserWithExpiry(data: RedisDomain): Promise<void>
  //set(prefix: string, key: string, value: string): Promise<void>
  /*setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>
  setUserWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>*/
}
