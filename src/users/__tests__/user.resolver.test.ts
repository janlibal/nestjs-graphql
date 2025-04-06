import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'

import { BadRequestException } from '@nestjs/common'
import { UserResolver } from '../user.resolver'
import { UserService } from '../user.service'
import { createUserInput } from './mock/user.data'
import { ValidateUserInputPipe } from '../pipes/validate-user-input.pipe'

const mockUserService = {
  createUser: vi.fn()
}

describe('UserResolver', () => {
  let userResolver: UserResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService
        }
      ]
    }).compile()

    userResolver = module.get<UserResolver>(UserResolver)

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userResolver).toBeDefined()
  })

  describe('UserResolver methods()', () => {
    describe('createUser()', () => {
      it('should register new user', async () => {
        mockUserService.createUser.mockResolvedValue(true)
        await userResolver.createUser(createUserInput)
        expect(mockUserService.createUser).toHaveBeenCalledWith(createUserInput)
      })
      it('should throw error when firstName is empty', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, firstName: '' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /BadRequestException: Firstname cannot be empty and must be a string. Firstname must be longer than 1 character./i
          )
        }
      })
      it('should throw error when firstName less than 2 characters long', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, firstName: 'J' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Firstname must be longer than 1 character./i)
        }
      })
      it('should throw error when firstName contains special characters', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, firstName: '@#@#' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Firstname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when firstName consists of only numbers', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, firstName: '123' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Firstname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when lastName is empty', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, lastName: '' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Lastname cannot be empty and must be a string./i)
        }
      })
      it('should throw error when lastName less than 2 characters long', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, lastName: 'D' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Lastname must be longer than 1 character./i)
        }
      })

      it('should throw error when lastName contains special characters', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, lastName: '@#@#' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Lastname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when lastName consists of only numbers', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, lastName: '123' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Lastname cannot contain special characters or numbers./i
          )
        }
      })
      it('should throw error when password is empty', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, password: '' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password cannot be empty./i)
        }
      })
      it('should throw error when password is less than 6 characters long', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, password: 'Pas' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password must be at least 6 characters long./i)
        }
      })
      it('should throw error when password is more than 20 characters long', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({
            ...createUserInput,
            password:
              'Password123!Password123!Password123!Password123!Password123!Password123!'
          }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(
            /Passwword can contain 20 characters at the most./i
          )
        }
      })
      it('should throw error when password is weak', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, password: 'Pas' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Password is too weak/i)
        }
      })
      it('should throw error when email is invalid', async () => {
        const pipe = new ValidateUserInputPipe()
        try {
          await pipe.transform({ ...createUserInput, email: 'aa@bb' }),
            { type: 'body' }
        } catch (err: any) {
          expect(err).toBeInstanceOf(BadRequestException)
          expect(err).toMatch(/Email is invalid./i)
        }
      })
    })
  })
})
