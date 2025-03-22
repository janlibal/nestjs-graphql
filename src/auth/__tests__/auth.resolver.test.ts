import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserModule } from '../../users/user.module'
import { PrismaModule } from '../../database/prisma.module'
import { SessionModule } from '../../session/session.module'
import { RedisModule } from '../../redis/redis.module'
import { GlobalConfigModule } from 'src/config/config/global-config.module'
import { AuthResolver } from '../auth.resolver'
import {
  loginData,
  mockLoginResponse,
  mockUser,
  registerInput,
} from './mock/auth.data'

const mockAuthService = {
  register: vi.fn(),
  validateLogin: vi.fn(),
}

describe('AuthResolver', () => {
  let authResolver: AuthResolver
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,

        SessionModule,

        RedisModule,
        PrismaModule,
        GlobalConfigModule,
      ],
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtService,
      ],
    }).compile()

    authResolver = module.get<AuthResolver>(AuthResolver)
    authService = module.get<AuthService>(AuthService)

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authResolver).toBeDefined()
  })

  describe('AuthResolver methods()', () => {
    describe('register()', () => {
      it('should register new user', async () => {
        mockAuthService.register.mockResolvedValue(true)
        await authResolver.register(registerInput)
        expect(mockAuthService.register).toHaveBeenCalledWith(registerInput)
      })
    })
    describe('login()', () => {
      it('should login a registered user', async () => {
        mockAuthService.validateLogin.mockResolvedValue(mockLoginResponse)
        const result = await authResolver.login(loginData)
        expect(result).toEqual(mockLoginResponse)
        expect(mockAuthService.validateLogin).toHaveBeenCalledWith(loginData)
      })
    })
  })
})
