import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'

import { UserService } from '../services/user.service'

import { PrismaService } from '../../database/prisma.service'
import { UserModule } from '../user.module'
import { PrismaModule } from '../../database/prisma.module'
import { userMockDomainObject, userObject } from './mock/user.data'
import { UserRepository } from '../repositories/user.repository'

// Mock Prisma Service
const mockUserRepository = {
  create: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
}

describe('UserService', () => {
  let userService: UserService
  let userRepository: UserRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        PrismaService,
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<UserRepository>(UserRepository)

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('UserService methods', () => {
    it('findByEmail()', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(userMockDomainObject)
      const result = await mockUserRepository.findByEmail(
        userMockDomainObject.email,
      )
      expect(result).toEqual(userMockDomainObject)
      //expect(mockPlaylistRepository.save).toHaveBeenCalledWith({data: createPlaylist,})
    })

    it('findById()', async () => {
      mockUserRepository.findById.mockResolvedValue(userMockDomainObject)
      const result = await mockUserRepository.findById(
        userMockDomainObject.email,
      )
      expect(result).toEqual(userMockDomainObject)
      //expect(mockPlaylistRepository.save).toHaveBeenCalledWith({data: createPlaylist,})
    })

    it('create()', async () => {
      mockUserRepository.create.mockResolvedValue(userMockDomainObject)
      const result = await mockUserRepository.create(userObject)
      expect(result).toEqual(userMockDomainObject)
      //expect(mockUserPersistence.create).toHaveBeenCalledWith({data: userMockEntityObject,})
    })
  })
})
