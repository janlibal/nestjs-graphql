import { Injectable } from '@nestjs/common'
import { ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { AllConfigType } from '../../config/config.type'
import { RedisService } from '../../redis/redis.service'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService<AllConfigType>
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context)
    const ctx = gqlContext.getContext().req

    if (!ctx) {
      throw new UnauthorizedException('No gqlContext!')
    }

    const authorization = ctx.headers.authorization

    if (!authorization) {
      throw new UnauthorizedException('No authorization!')
    }

    if (!authorization || Array.isArray(authorization) || typeof authorization !== 'string')
      throw new UnauthorizedException('Invalid headers!')

    const [jwt, accessToken] = authorization.split(' ')

    if (jwt !== 'jwt') throw new UnauthorizedException('No jwt!')

    const token = authorization.split(' ')[1] // The headers are attached to the request

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    const authSecret = this.configService.getOrThrow('auth.secret', {
      infer: true
    })

    const data = await this.verifyToken(accessToken, authSecret)

    if (!data) throw new UnauthorizedException('Invalid or expired token')

    const redisObject = await this.redisService.getSession(data.id)

    const isTokenFromCacheSameAsTokenFromHeaders = redisObject === accessToken

    if (!isTokenFromCacheSameAsTokenFromHeaders) throw new UnauthorizedException('Nice try')

    // Attach the user to the request context for later use

    ctx.user = data

    return true
  }

  async verifyToken(accessToken: string, authSecret: string) {
    try {
      const data = await this.jwtService.verifyAsync(accessToken, {
        secret: authSecret
      })
      if (!data) {
        throw new UnauthorizedException('Invalid token')
      }
      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired')
      }
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
