import { Injectable } from '@nestjs/common'
import { User } from 'src/users/model/user.model'
import { JwtService } from '@nestjs/jwt'

import { fakeUser } from './cache/db'
import crypto from 'src/utils/crypto'
import { Session } from 'src/session/session.model'
import ms from 'ms'
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthEmailLoginInput } from './inputs/login-user.input'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async validateLogin(
    loginDto: AuthEmailLoginInput,
  ): Promise<LoginResponseDto> {
    const user = fakeUser

    const hash = await crypto.makeHash()
    const userId = user.id
    const sessionId = '1'

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: sessionId,
      hash,
    })

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    }
  }

  private async getTokensData(data: {
    id: User['id']
    role: User['role']
    sessionId: Session['id']
    hash: Session['hash']
  }) {
    const tokenExpiresIn = '15m'

    const tokenExpires = Date.now() + ms(tokenExpiresIn)

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: 'mynewsecret',
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: 'myrefresthsecret',
          expiresIn: '30d',
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
