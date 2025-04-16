import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { UserService } from '../user.service'

import hashPassword from '../../utils/crypto'
import { ConflictException, UnprocessableEntityException } from '@nestjs/common'
import {
  createUserInput,
  rawUserDomainObject,
  rawUserEntityObject,
  userObjectHashedPwd
} from './mock/user.data'
import { userMockEntityObjects } from './mock/user.data-helper'
import { UserRepository } from '../infrastructure/repository/user.repository'

describe('UserService', () => {
  let userService: UserService
  const mockUserRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findMany: vi.fn(),
    findByFirstNames: vi.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository
        }
      ]
    }).compile()

    userService = module.get<UserService>(UserService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('UserService methods', () => {
    describe('findById()', () => {
      it('should return user object if Id provided', async () => {
        mockUserRepository.findById.mockResolvedValue(rawUserDomainObject)
        const result = await userService.findById(rawUserDomainObject.id)
        expect(result).toEqual(rawUserDomainObject)
        expect(mockUserRepository.findById).toHaveBeenCalledWith(rawUserDomainObject.id)
      })
      it('should throw UnprocessableEntityException if user not found', async () => {
        mockUserRepository.findById.mockResolvedValue(null)
        try {
          await userService.findById('999')
        } catch (error) {
          expect(error).toBeInstanceOf(UnprocessableEntityException)
        }
      })
    })
    describe('findByEmail()', () => {
      it('should return user object if email provided', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(rawUserDomainObject)
        const result = await userService.findByEmail(rawUserDomainObject.email)
        expect(result).toEqual(rawUserDomainObject)
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(rawUserDomainObject.email)
      })
    })
    describe('getAll()', () => {
      it('should return all users', async () => {
        const userEntityObjects = userMockEntityObjects(rawUserEntityObject, 5)
        mockUserRepository.findMany.mockResolvedValue(userEntityObjects)
        const result = await userService.getAll()
        expect(result).toEqual(userEntityObjects)
        expect(mockUserRepository.findMany).toHaveBeenCalled()
      })
    })
    describe('getByFirstNames()', () => {
      it('should return all users based on firstNames search', async () => {
        //mockUserRepository.findByFirstNames.mockResolvedValue(allUsers.map(a => a.firstName === 'Joe'))
        const userEntityObjects = userMockEntityObjects(rawUserEntityObject, 5)

        mockUserRepository.findByFirstNames.mockResolvedValue(
          userEntityObjects.filter((user) => ['Joe'].some((names) => names === user.firstName))
        )
        const result = await userService.getByFirstNames(['Joe'])
        //expect(result).toEqual(allUsers.map(a => a.firstName === 'Joe'))
        expect(result).toEqual(
          userEntityObjects.filter((user) => ['Joe'].some((names) => names === user.firstName))
        )
        expect(mockUserRepository.findByFirstNames).toHaveBeenCalledWith(['Joe'])
      })
    })
    describe('createUser', () => {
      it('should throw ConflictException if user with email already exists', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({})
        await expect(userService.createUser(rawUserDomainObject)).rejects.toThrowError(
          ConflictException
        )
      })
      it('should throw UnprocessableEntityException if role does not exist', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)
        await expect(
          userService.createUser({ ...createUserInput, role: { id: 999 } })
        ).rejects.toThrowError(UnprocessableEntityException)
      })
      it('should throw UnprocessableEntityException if status does not exist', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)

        await expect(
          userService.createUser({ ...createUserInput, status: { id: 999 } })
        ).rejects.toThrowError(UnprocessableEntityException)
      })
      it('should successfully create a user and save it', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)

        const hashPasswordSpy = vi
          .spyOn(hashPassword, 'hashPassword')
          .mockResolvedValue('hashedPassword123!')

        mockUserRepository.save.mockResolvedValue(rawUserDomainObject)

        const result = await userService.createUser(createUserInput)

        expect(mockUserRepository.save).toHaveBeenCalledWith(
          expect.objectContaining(userObjectHashedPwd)
        )

        expect(result).toEqual(rawUserDomainObject)

        expect(hashPasswordSpy).toHaveBeenCalled()
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserInput.email)
      })
    })
  })
})
