import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaService } from '../../database/prisma.service'
import {
  sessionMockDomainObject,
  sessionMockEntityObject,
  sessionObject,
} from './mock/session.data'
import { SessionRepository } from '../session.repository'
import { SessionMapper } from '../mappers/session.mapper'

const mockPrismaService = {
  session: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
  },
}

describe('SessionRepository', () => {
  let sessionRepository: SessionRepository
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    sessionRepository = module.get<SessionRepository>(SessionRepository)
    prismaService = module.get<PrismaService>(PrismaService)

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sessionRepository).toBeDefined()
  })

  describe('SessionRepository', () => {
    it('deleteById()', async () => {
      vi.spyOn(prismaService.session, 'delete').mockResolvedValue(null)

      await sessionRepository.deleteById(sessionMockDomainObject.id)

      expect(mockPrismaService.session.delete).toHaveBeenCalledWith({
        where: { id: sessionMockDomainObject.id },
      })

      expect(prismaService.session.delete).toHaveBeenCalledTimes(1)
    })

    it('findById()', async () => {
      vi.spyOn(prismaService.session, 'findFirst').mockResolvedValue(
        sessionMockEntityObject,
      )

      const result = await sessionRepository.findById(
        sessionMockDomainObject.id,
      )

      expect(result).toEqual(sessionMockDomainObject)

      expect(mockPrismaService.session.findFirst).toHaveBeenCalledWith({
        include: { user: true },
        where: { id: sessionMockDomainObject.id },
      })
    })

    it('deleteByUserId()', async () => {
      vi.spyOn(prismaService.session, 'delete').mockResolvedValue(null)

      const conditions = {
        userId: sessionMockDomainObject.userId,
      }

      await sessionRepository.deleteByUserId(conditions)

      expect(mockPrismaService.session.delete).toHaveBeenCalledWith({
        include: { user: true },
        where: { id: Number(conditions.userId) },
      })

      expect(prismaService.session.delete).toHaveBeenCalledTimes(1)
    })

    it('create()', async () => {
      const persistenceModel = await SessionMapper.toPersistence(sessionObject)

      vi.spyOn(prismaService.session, 'create').mockResolvedValue(
        sessionMockEntityObject,
      )

      const result = await sessionRepository.create(sessionObject)

      expect(result).toEqual(sessionMockDomainObject)

      expect(mockPrismaService.session.create).toHaveBeenCalledWith({
        data: persistenceModel,
      })
    })
  })
})
