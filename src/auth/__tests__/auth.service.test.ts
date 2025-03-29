import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { UserService } from '../../users/user.service'
import { AuthService } from '../auth.service'
import { GlobalConfigModule } from 'src/config/config/global-config.module'
import { SessionService } from '../../session/session.service'
import { RedisService } from '../../redis/redis.service'
import { JwtService } from '@nestjs/jwt'
import {
  loginData,
  loginDataBad,
  mockUser,
  mockUserGoogle,
  registerInput,
  sessionData,
} from './mock/auth.data'
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import crypto from '../../utils/crypto'
import { RedisPrefixEnum } from 'src/redis/enums/redis.prefix.enum'

describe('SessionService', () => {
  let authService: AuthService

  const mockUserService = {
    createUser: vi.fn(),
    findByEmail: vi.fn(),
  }

  const mockSessionService = {
    create: vi.fn(),
  }

  const mockRedisService = {
    createSession: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalConfigModule],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        JwtService,
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('AuthService methods', () => {
    describe('register()', () => {
      it('should register new user', async () => {
        mockUserService.createUser.mockResolvedValue(true)
        await authService.register(registerInput)
        expect(mockUserService.createUser).toHaveBeenCalled()
      })
    })

    describe('validateLogin()', () => {
      it('should throw unauthorized exception if user does not exist', async () => {
        mockUserService.findByEmail.mockResolvedValue(null)
        await expect(authService.validateLogin(registerInput)).rejects.toThrow(
          UnauthorizedException,
        )
      })

      it('should throw Unauthorized if user provider is not email', async () => {
        mockUserService.findByEmail.mockResolvedValue(mockUserGoogle)
        await expect(authService.validateLogin(loginData)).rejects.toThrowError(
          UnprocessableEntityException,
        )
      })

      it('should throw Unauthorized if user provider is not email', async () => {
        mockUserService.findByEmail.mockResolvedValue(mockUserGoogle)
        await expect(authService.validateLogin(loginData)).rejects.toThrowError(
          UnprocessableEntityException,
        )
      })

      it('should throw UnprocessableEntityException there is missing password', async () => {
        mockUserService.findByEmail.mockResolvedValue(mockUserGoogle)
        await expect(authService.validateLogin(loginData)).rejects.toThrowError(
          UnprocessableEntityException,
        )
      })

      it('should throw error for invalid password', async () => {
        mockUserService.findByEmail.mockResolvedValue(mockUser)
        const comparePasswordsSpy = vi
          .spyOn(crypto, 'comparePasswords')
          .mockResolvedValue(false)
        await expect(authService.validateLogin(loginDataBad)).rejects.toThrow(
          UnauthorizedException,
        )
        expect(comparePasswordsSpy).toHaveBeenCalledWith(
          loginDataBad.password,
          mockUser.password,
        )
        expect(mockUserService.findByEmail).toHaveBeenCalledWith(
          loginDataBad.email,
        )
      })

      it('should return user data after successful login', async () => {
        const prefix = RedisPrefixEnum.USER
        const expiry = 900000
        mockUserService.findByEmail.mockResolvedValue(mockUser)
        const comparePasswordsSpy = vi
          .spyOn(crypto, 'comparePasswords')
          .mockResolvedValue(true)
        const makeHashSpy = vi
          .spyOn(crypto, 'makeHash')
          .mockReturnValue('hash123')
        mockSessionService.create.mockResolvedValue(sessionData)
        mockRedisService.createSession.mockResolvedValue(true)

        const result = await authService.validateLogin(loginData)
        expect(result.refreshToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        expect(result.token).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        expect(mockUserService.findByEmail).toHaveBeenCalledWith(
          loginData.email,
        )
        expect(result.tokenExpires).toBeDefined()
        expect(result.user).toEqual(mockUser)
        expect(comparePasswordsSpy).toHaveBeenCalledWith(
          loginData.password,
          mockUser.password,
        )
        expect(makeHashSpy).toHaveBeenCalled()
        expect(mockSessionService.create).toHaveBeenCalledWith(sessionData)
        expect(mockRedisService.createSession).toHaveBeenCalledWith({
          prefix: prefix,
          user: result.user,
          token: result.token,
          expiry: expiry,
        })
      })
    })
  })
})
