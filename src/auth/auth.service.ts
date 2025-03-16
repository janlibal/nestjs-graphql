import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { User as UserModel } from 'src/users/model/user.model'
import { JwtService } from '@nestjs/jwt'
import crypto from 'src/utils/crypto'
import { Session } from 'src/session/session.model'
import ms from 'ms'
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthEmailLoginInput } from './inputs/auth-email-login.input'
import { UserService } from 'src/users/services/user.service'
import { AuthProvidersEnum } from 'src/users/enums/auth.provider.enum'
import { ConfigService } from '@nestjs/config'
import { AuthEmailRegisterInput } from './inputs/auth-email-register.input'
import { RoleEnum } from 'src/roles/role.enum'
import { StatusEnum } from 'src/statuses/status.enum'



@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService, private configService: ConfigService) {}
  async validateLogin(loginInput: AuthEmailLoginInput,): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginInput.email)

    if(!user) throw new UnauthorizedException('Unauthorized!')
    if(user.provider !== AuthProvidersEnum.email) throw new UnprocessableEntityException(`Has to login via provider ${user.provider}`)
    if(!user.password) throw new UnprocessableEntityException('Missing password')

    const isValidPassword = await crypto.comparePasswords(
      loginInput.password,
      user.password,
    )
    if(!isValidPassword) throw new UnauthorizedException('Unauthorized!')


    const hash = await crypto.makeHash()

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      //sessionId: sessionId,
      hash,
    })

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    }
  }

  async register(registerInput: AuthEmailRegisterInput,): Promise<boolean> {
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
    //sessionId: Session['id']
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
          //sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          //sessionId: data.sessionId,
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
}
