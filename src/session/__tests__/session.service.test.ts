import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaService } from '../../database/prisma.service'
import { PrismaModule } from '../../database/prisma.module'
import { SessionService } from '../session.service'

import { SessionModule } from '../session.module'

import { sessionMockDomainObject, sessionObject } from './mock/session.data'
import { SessionRepository } from '../session.repository'

// Mock Prisma Service
const mockSessionRepository = {
  create: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  deleteById: vi.fn(),
  deleteByUserId: vi.fn(),
}

describe('SessionService', () => {
  let sessionService: SessionService
  let sessionRepository: SessionRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SessionModule, PrismaModule],
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: mockSessionRepository,
        },
        PrismaService,
      ],
    }).compile()

    sessionService = module.get<SessionService>(SessionService)
    sessionRepository = module.get<SessionRepository>(SessionRepository)

    vi.restoreAllMocks()
  })
  

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sessionService).toBeDefined()
  })

  describe('SessionService Operations', () => {
    /*it('deleteByUserId()', async () => {
      vi.spyOn(mockSessionRepository, 'deleteByUserId').mockResolvedValue(null)

      const conditions = {
        userId: sessionMockDomainObject.userId,
      }

      await sessionRepository.deleteByUserId(conditions)

      expect(mockSessionRepository.deleteByUserId).toHaveBeenCalledWith(
        conditions,
      )

      expect(mockSessionRepository.deleteByUserId).toHaveBeenCalledTimes(1)
    })

    it('deleteById()', async () => {
      vi.spyOn(mockSessionRepository, 'deleteById').mockResolvedValue(null)

      await sessionRepository.deleteById(sessionMockDomainObject.id)

      expect(mockSessionRepository.deleteById).toHaveBeenCalledWith(
        sessionMockDomainObject.id,
      )

      expect(mockSessionRepository.deleteById).toHaveBeenCalledTimes(1)
    })

    it('findById()', async () => {
      mockSessionRepository.findById.mockResolvedValue(sessionMockDomainObject)
      const result = await sessionRepository.findById(
        sessionMockDomainObject.id,
      )
      expect(result).toEqual(sessionMockDomainObject)
      //expect(mockPlaylistRepository.save).toHaveBeenCalledWith({data: createPlaylist,})
    })*/

    it('create()', async () => {
      mockSessionRepository.create.mockResolvedValue(sessionMockDomainObject)
      const result = await sessionRepository.create(sessionObject)
      expect(result).toEqual(sessionMockDomainObject)
      //expect(mockUserPersistence.create).toHaveBeenCalledWith({data: userMockEntityObject,})
    })
  })
})
