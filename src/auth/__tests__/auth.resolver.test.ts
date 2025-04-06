import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'
import { GlobalConfigModule } from '../../config/global-config.module'
import { AuthResolver } from '../auth.resolver'
import { loginData, mockLoginResponse, registerInput } from './mock/auth.data'
import { ValidateRegisterPipe } from '../pipes/validate-register.pipe'
import { BadRequestException } from '@nestjs/common'
import { ValidateLoginPipe } from '../pipes/validate-login.pipe'
import { RedisService } from '../../redis/redis.service'

const mockAuthService = {
  register: vi.fn(),
  validateLogin: vi.fn()
}

let mockRedisService: any

describe('AuthResolver', () => {
  let authResolver: AuthResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalConfigModule],
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: RedisService,
          useValue: mockRedisService
        },
        JwtService
      ]
    }).compile()

    authResolver = module.get<AuthResolver>(AuthResolver)

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
      it('should throw error when firstName is empty', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, firstName: '' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /BadRequestException: Firstname cannot be empty and must be a string. Firstname must be longer than 1 character./i
          )
        }
      })
      it('should throw error when firstName less than 2 characters long', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, firstName: 'J' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Firstname must be longer than 1 character./i)
        }
      })
      it('should throw error when firstName contains special characters', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, firstName: '@#@#' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Firstname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when firstName consists of only numbers', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, firstName: '123' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Firstname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when lastName is empty', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, lastName: '' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Lastname cannot be empty and must be a string./i)
        }
      })
      it('should throw error when lastName less than 2 characters long', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, lastName: 'D' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Lastname must be longer than 1 character./i)
        }
      })

      it('should throw error when lastName contains special characters', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, lastName: '@#@#' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Lastname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when lastName consists of only numbers', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, lastName: '123' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Lastname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when password is empty', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, password: '' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password cannot be empty./i)
        }
      })
      it('should throw error when password is less than 6 characters long', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, password: 'Pas' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password must be at least 6 characters long./i)
        }
      })
      it('should throw error when password is more than 20 characters long', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({
            ...registerInput,
            password:
              'Password123!Password123!Password123!Password123!Password123!Password123!'
          }) //,{ type: 'body' }{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Passwword can contain 20 characters at the most./i
          )
        }
      })
      it('should throw error when password is weak', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, password: 'Pas' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password is too weak/i)
        }
      })
      it('should throw error when email is invalid', async () => {
        const pipe = new ValidateRegisterPipe()
        try {
          await pipe.transform({ ...registerInput, email: 'aa@bb' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Email is invalid./i)
        }
      })
    })
    describe('login()', () => {
      it('should login a registered user', async () => {
        mockAuthService.validateLogin.mockResolvedValue(mockLoginResponse)
        const result = await authResolver.login(loginData)
        expect(result).toEqual(mockLoginResponse)
        expect(mockAuthService.validateLogin).toHaveBeenCalledWith(loginData)
      })
      it('should throw error when email is invalid', async () => {
        const pipe = new ValidateLoginPipe()
        try {
          await pipe.transform({ ...registerInput, email: 'aa@bb' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Email is invalid./i)
        }
      })
      it('should throw error when password is empty', async () => {
        const pipe = new ValidateLoginPipe()
        try {
          await pipe.transform({ ...registerInput, password: '' }) //,{ type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password cannot be empty./i)
        }
      })
    })
  })
})
