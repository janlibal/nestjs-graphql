import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaModule } from '../../database/prisma.module'
import { UserService } from '../user.service'
import { UserRepository } from '../user.repository'
import hashPassword from '../../utils/crypto'
import { ConflictException, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserInput } from '../inputs/create.user.intput'
import {
  allUsers,
  createUserInput,
  userMockDomainObject,
  userObject,
  userObjectHashedPwd,
} from './mock/user.data'

describe('SessionService', () => {
  let userService: UserService
  const mockUserRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    findByFirstNames: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
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
        mockUserRepository.findById.mockResolvedValue(userMockDomainObject)
        const result = await userService.findById(userMockDomainObject.id)
        expect(result).toEqual(userMockDomainObject)
        expect(mockUserRepository.findById).toHaveBeenCalledWith(
          userMockDomainObject.id,
        )
      })
      it('should throw UnprocessableEntityException if user not found', async () => {
        mockUserRepository.findById.mockResolvedValue(null)
        try {
          await userService.findById('999') // Try with an id that doesn't exist
        } catch (error) {
          expect(error).toBeInstanceOf(UnprocessableEntityException)
        }
      })
    })
    describe('findByEmail()', () => {
      it('should return user object if email provided', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(userMockDomainObject)
        const result = await userService.findByEmail(userMockDomainObject.email)
        expect(result).toEqual(userMockDomainObject)
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
          userMockDomainObject.email,
        )
      })
    })
    describe('getAll()', () => {
      it('should return all users', async () => {
        mockUserRepository.findAll.mockResolvedValue(allUsers)
        const result = await userService.getAll()
        expect(result).toEqual(allUsers)
        expect(mockUserRepository.findAll).toHaveBeenCalled()
      })
    })
    describe('getByFirstNames()', () => {
      it('should return all users based on firstNames search', async () => {
        //mockUserRepository.findByFirstNames.mockResolvedValue(allUsers.map(a => a.firstName === 'Joe'))
        mockUserRepository.findByFirstNames.mockResolvedValue(
          allUsers.filter((user) =>
            ['Joe'].some((names) => names === user.firstName),
          ),
        )
        const result = await userService.getByFirstNames(['Joe'])
        //expect(result).toEqual(allUsers.map(a => a.firstName === 'Joe'))
        expect(result).toEqual(
          allUsers.filter((user) =>
            ['Joe'].some((names) => names === user.firstName),
          ),
        )
        expect(mockUserRepository.findByFirstNames).toHaveBeenCalledWith([
          'Joe',
        ])
      })
    })
    describe('createUser', () => {
      it('should throw ConflictException if user with email already exists', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({})
        await expect(userService.createUser(userObject)).rejects.toThrowError(
          ConflictException,
        )
      })
      it('should throw UnprocessableEntityException if role does not exist', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)
        await expect(
          userService.createUser({ ...createUserInput, role: { id: 999 } }),
        ).rejects.toThrowError(UnprocessableEntityException)
      })
      it('should throw UnprocessableEntityException if status does not exist', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)

        await expect(
          userService.createUser({ ...createUserInput, status: { id: 999 } }),
        ).rejects.toThrowError(UnprocessableEntityException)
      })
      it('should successfully create a user and save it', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)

        // Mock hashPassword to return a hashed password
        const hashPasswordSpy = vi
          .spyOn(hashPassword, 'hashPassword')
          .mockResolvedValue('hashedPassword123!')

        // Mock save method to return the saved user object
        mockUserRepository.save.mockResolvedValue(userMockDomainObject)

        const result = await userService.createUser(createUserInput)

        // Assert that the user is created and saved with the correct hashed password
        expect(mockUserRepository.save).toHaveBeenCalledWith(
          expect.objectContaining(userObjectHashedPwd),
        )

        expect(result).toEqual(userMockDomainObject)

        expect(hashPasswordSpy).toHaveBeenCalled()
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
          createUserInput.email,
        )
      })
    })
  })
})
