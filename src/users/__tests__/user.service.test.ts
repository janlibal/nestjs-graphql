import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaModule } from '../../database/prisma.module'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repositories/user.repository'
import { userObject } from './mock/user.data'
import hashPassword from '../../utils/crypto'
import { ConflictException, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserInput } from '../inputs/create.user.intput'

describe('SessionService', () => {
  let userService: UserService
  const mockUserRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
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
    describe('createUser', () => {
      it('should throw ConflictException if user with email already exists', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({})
        await expect(userService.createUser(userObject)).rejects.toThrowError(
          ConflictException,
        )
      })
      it('should throw UnprocessableEntityException if role does not exist', async () => {
        const createUserInput: CreateUserInput = {
          email: 'jan.libal@jablibal.com',
          password: 'Password123!',
          firstName: 'Jan',
          lastName: 'Libal',
          role: { id: 999 },
          status: { id: 1 },
        }
        mockUserRepository.findByEmail.mockResolvedValue(null)
        await expect(
          userService.createUser(createUserInput),
        ).rejects.toThrowError(UnprocessableEntityException)
      })
      it('should throw UnprocessableEntityException if status does not exist', async () => {
        const createUserInput: CreateUserInput = {
          email: 'jan.libal@jablibal.com',
          password: 'Password123!',
          firstName: 'Jan',
          lastName: 'Libal',
          role: { id: 1 },
          status: { id: 999 }, // Invalid status ID
        }

        mockUserRepository.findByEmail.mockResolvedValue(null)

        await expect(
          userService.createUser(createUserInput),
        ).rejects.toThrowError(UnprocessableEntityException)
      })
      it('should successfully create a user and save it', async () => {
        const createUserInput: CreateUserInput = {
          email: 'jan.libal@jablibal.com',
          password: 'Password123!',
          firstName: 'Jan',
          lastName: 'Libal',
          role: { id: 1 },
          status: { id: 1 },
        }

        mockUserRepository.findByEmail.mockResolvedValue(null)

        // Mock hashPassword to return a hashed password
        const hashPasswordSpy = vi
          .spyOn(hashPassword, 'hashPassword')
          .mockResolvedValue('hashedPassword123!')

        // Mock save method to return the saved user object
        mockUserRepository.save.mockResolvedValue({
          id: '1',
          email: 'jan.libal@jablibal.com',
          firstName: 'Jan',
          lastName: 'Libal',
          role: { id: 1 },
          status: { id: 1 },
          password: 'hashedPassword123!',
        })

        const result = await userService.createUser(createUserInput)

        // Assert that the user is created and saved with the correct hashed password
        expect(mockUserRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'jan.libal@jablibal.com',
            password: 'hashedPassword123!',
            firstName: 'Jan',
            lastName: 'Libal',
            role: { id: 1 },
            status: { id: 1 },
          }),
        )

        expect(result).toEqual({
          id: '1',
          email: 'jan.libal@jablibal.com',
          password: 'hashedPassword123!',
          firstName: 'Jan',
          lastName: 'Libal',
          role: { id: 1 },
          status: { id: 1 },
        })

        expect(hashPasswordSpy).toHaveBeenCalled()
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
          createUserInput.email,
        )
      })
    })
  })
})
