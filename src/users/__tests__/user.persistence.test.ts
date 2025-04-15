import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect, afterEach } from 'vitest'
import { PrismaService } from '../../database/prisma.service'

import { rawUserDomainObject, rawUserEntityObject } from './mock/user.data'
import {
  userMockDomainObjects,
  userMockEntityObjects
} from './mock/user.data-helper'
import { UserMapper } from '../infrastructure/mappers/user.mapper'
import { UserPersistence } from '../infrastructure/persistence/user.persistence'

const mockPrismaService = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findByFirstNames: vi.fn()
  }
}

describe('UserPersistence', () => {
  let userPersistence: UserPersistence
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPersistence,
        { provide: PrismaService, useValue: mockPrismaService }
      ]
    }).compile()

    userPersistence = module.get<UserPersistence>(UserPersistence)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userPersistence).toBeDefined()
  })

  describe('UserPersistence Methods', () => {
    it('should return users containing provided firstNames', async () => {
      const userEntityObjects = userMockEntityObjects(rawUserEntityObject, 5)
      vi.spyOn(prismaService.user, 'findMany').mockResolvedValue(
        userEntityObjects
      )

      const result = await userPersistence.findByFirstNames(['Joe1', 'Joe5'])

      expect(result).toEqual(userEntityObjects)

      expect(mockPrismaService.user.findMany).toHaveBeenCalled()
    })
    it('should find all users', async () => {
      const userEntityObjects = userMockEntityObjects(rawUserEntityObject, 5)
      const userDomainObjects = userMockDomainObjects(rawUserDomainObject, 5)
      vi.spyOn(prismaService.user, 'findMany').mockResolvedValue(
        userEntityObjects
      )

      const result = await userPersistence.findMany()

      expect(result).toEqual(userDomainObjects)

      expect(mockPrismaService.user.findMany).toHaveBeenCalled()
    })

    it('should find user by provided Id', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        rawUserEntityObject
      )

      const result = await userPersistence.findById(rawUserDomainObject.id)

      expect(result).toEqual(rawUserDomainObject)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: String(rawUserDomainObject.id) }
      })
    })

    it('should find user by provided email', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        rawUserEntityObject
      )

      const result = await userPersistence.findByEmail(
        rawUserDomainObject.email
      )

      expect(result).toEqual(rawUserDomainObject)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: rawUserDomainObject.email }
      })
    })

    it('should create new user', async () => {
      const persistenceModel =
        await UserMapper.toPersistence(rawUserDomainObject)

      vi.spyOn(prismaService.user, 'create').mockResolvedValue(
        rawUserEntityObject
      )

      const result = await userPersistence.save(rawUserDomainObject)

      expect(result).toEqual(rawUserDomainObject)

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: persistenceModel
      })
    })

    it('should delete user by provided Id', async () => {
      vi.spyOn(prismaService.user, 'delete').mockResolvedValue(null)

      await userPersistence.remove(rawUserDomainObject.id)

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: String(rawUserDomainObject.id) }
      })

      expect(prismaService.user.delete).toHaveBeenCalledTimes(1)
    })
  })
})
