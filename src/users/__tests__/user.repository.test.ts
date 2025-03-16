import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaService } from '../../database/prisma.service'
import { UserRepository } from '../repositories/user.repository'
import {
  userMockDomainObject,
  userMockEntityObject,
  userObject,
} from './mock/user.data'
import { UserMapper } from '../mapper/user.mapper'

const mockPrismaService = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
  },
}

describe('UserRepository', () => {
  let userRepository: UserRepository
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    userRepository = module.get<UserRepository>(UserRepository)
    prismaService = module.get<PrismaService>(PrismaService)

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userRepository).toBeDefined()
  })

  describe('UserRepository Methods', () => {
    it('findById()', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        userMockEntityObject,
      )

      const result = await userRepository.findById(userMockDomainObject.id)

      // Assert: Check that the result is the expected domain model
      expect(result).toEqual(userMockDomainObject)

      // Assert: Check that Prisma's `create` method was called with correct arguments
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: String(userMockDomainObject.id) },
      })
    })

    it('findByEmail()', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        userMockEntityObject,
      )

      const result = await userRepository.findByEmail(userObject.email)

      // Assert: Check that the result is the expected domain model
      expect(result).toEqual(userMockDomainObject)

      // Assert: Check that Prisma's `create` method was called with correct arguments
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: userObject.email },
      })
    })

    it('create()', async () => {
      const persistenceModel = await UserMapper.toPersistence(userObject)

      vi.spyOn(prismaService.user, 'create').mockResolvedValue(
        userMockEntityObject,
      )

      const result = await userRepository.save(userObject)

      // Assert: Check that the result is the expected domain model
      expect(result).toEqual(userMockDomainObject)

      // Assert: Check that Prisma's `create` method was called with correct arguments
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: persistenceModel,
      })
    })

    it('remove()', async () => {
      vi.spyOn(prismaService.user, 'delete').mockResolvedValue(null)

      await userRepository.remove(userMockDomainObject.id)

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: String(userMockDomainObject.id) },
      })

      expect(prismaService.user.delete).toHaveBeenCalledTimes(1)
    })
  })
})
