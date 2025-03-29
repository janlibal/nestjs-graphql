import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaService } from '../../database/prisma.service'
import { UserRepository } from '../user.repository'
import { rawUserDomainObject, rawUserEntityObject } from './mock/user.data'
import {
  userMockDomainObjects,
  userMockEntityObjects,
} from './mock/user.data-helper'
import { UserMapper } from '../mapper/user.mapper'

const mockPrismaService = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findByFirstNames: vi.fn(),
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
    it('findByFirstNames()', async () => {
      const userEntityObjects = userMockEntityObjects(rawUserEntityObject, 5)
      vi.spyOn(prismaService.user, 'findMany').mockResolvedValue(
        userEntityObjects,
      )

      const result = await userRepository.findByFirstNames(['Joe1', 'Joe5'])

      expect(result).toEqual(userEntityObjects)

      expect(mockPrismaService.user.findMany).toHaveBeenCalled()
    })
    it('findAll()', async () => {
      const userEntityObjects = userMockEntityObjects(rawUserEntityObject, 5)
      const userDomainObjects = userMockDomainObjects(rawUserDomainObject, 5)
      vi.spyOn(prismaService.user, 'findMany').mockResolvedValue(
        userEntityObjects,
      )

      const result = await userRepository.findAll()

      expect(result).toEqual(userDomainObjects)

      expect(mockPrismaService.user.findMany).toHaveBeenCalled()
    })

    it('findById()', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        rawUserEntityObject,
      )

      const result = await userRepository.findById(rawUserDomainObject.id)

      expect(result).toEqual(rawUserDomainObject)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: String(rawUserDomainObject.id) },
      })
    })

    it('findByEmail()', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        rawUserEntityObject,
      )

      const result = await userRepository.findByEmail(rawUserDomainObject.email)

      expect(result).toEqual(rawUserDomainObject)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: rawUserDomainObject.email },
      })
    })

    it('create()', async () => {
      const persistenceModel =
        await UserMapper.toPersistence(rawUserDomainObject)

      vi.spyOn(prismaService.user, 'create').mockResolvedValue(
        rawUserEntityObject,
      )

      const result = await userRepository.save(rawUserDomainObject)

      expect(result).toEqual(rawUserDomainObject)

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: persistenceModel,
      })
    })

    it('remove()', async () => {
      vi.spyOn(prismaService.user, 'delete').mockResolvedValue(null)

      await userRepository.remove(rawUserDomainObject.id)

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: String(rawUserDomainObject.id) },
      })

      expect(prismaService.user.delete).toHaveBeenCalledTimes(1)
    })
  })
})
