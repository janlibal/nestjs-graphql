import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { User, User as UserModel } from '../users/model/user.model'
import { JwtService } from '@nestjs/jwt'
import crypto from '../utils/crypto'
import ms from 'ms'
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthEmailLoginInput } from './inputs/auth-email-login.input'
import { UserService } from '../users/services/user.service'
import { AuthProvidersEnum } from '../users/enums/auth.provider.enum'
import { ConfigService } from '@nestjs/config'
import { AuthEmailRegisterInput } from './inputs/auth-email-register.input'
import { RoleEnum } from '../roles/role.enum'
import { StatusEnum } from '../statuses/status.enum'
import { SessionService } from '../session/session.service'
import { Session } from '../session/domain/session.domain'
import { RedisPrefixEnum } from '../redis/enums/redis.prefix.enum'
import { RedisService } from '../redis/redis.service'
import { NullableType } from 'src/utils/types/nullable.type'
import { JwtPayloadType } from './strategies/types/jwt.payload.type'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private sessionService: SessionService,
    private redisService: RedisService,
  ) {}

  async validateLogin(
    loginInput: AuthEmailLoginInput,
  ): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginInput.email)

    if (!user) throw new UnauthorizedException('Unauthorized!')
    if (user.provider !== AuthProvidersEnum.email)
      throw new UnprocessableEntityException(
        `Has to login via provider ${user.provider}`,
      )
    if (!user.password)
      throw new UnprocessableEntityException('Missing password')

    const isValidPassword = await crypto.comparePasswords(
      loginInput.password,
      user.password,
    )
    if (!isValidPassword) throw new UnauthorizedException('Unauthorized!')

    const hash = crypto.makeHash()
    const userId = user.id

    const session = await this.sessionService.create({ userId, hash })

    const prefix = RedisPrefixEnum.USER
    const expiry = this.configService.getOrThrow('redis.expiry', {
      infer: true,
    })

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    })

    await this.redisService.createSession({ prefix, user, token, expiry })

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    }
  }

  async register(registerInput: AuthEmailRegisterInput): Promise<boolean> {
    const user = await this.userService.createUser({
      firstName: registerInput.firstName,
      lastName: registerInput.lastName,
      password: registerInput.password,
      email: registerInput.email,
      role: {
        id: RoleEnum.user,
      },
      status: { id: StatusEnum.active },
    })
    return true
  }

  private async getTokensData(data: {
    id: UserModel['id']
    role: UserModel['role']
    sessionId: Session['id']
    hash: Session['hash']
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    })

    const tokenExpires = Date.now() + ms(tokenExpiresIn)

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ])

    return {
      token,
      refreshToken,
      tokenExpires,
    }
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.userService.findById(userJwtPayload.id)
  }
}
