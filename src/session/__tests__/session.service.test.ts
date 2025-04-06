import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { SessionService } from '../session.service'
import { sessionMockDomainObject, sessionObject } from './mock/session.data'
import { SessionRepository } from '../infrastructure/repository/session.repository'

describe('SessionService', () => {
  let sessionService: SessionService
  const mockSessionRepository = {
    create: vi.fn(),
    deleteById: vi.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: mockSessionRepository
        }
      ]
    }).compile()

    sessionService = module.get<SessionService>(SessionService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sessionService).toBeDefined()
  })

  describe('SessionService methods', () => {
    it('should create new session', async () => {
      mockSessionRepository.create.mockResolvedValue(sessionMockDomainObject)

      const result = await sessionService.create(sessionObject)

      expect(result).toEqual(sessionMockDomainObject)

      expect(mockSessionRepository.create).toHaveBeenCalledWith(sessionObject)
      expect(mockSessionRepository.create).toHaveBeenCalledTimes(1)
    })
    it('should delte session by provided userId', async () => {
      mockSessionRepository.deleteById.mockResolvedValue(true)
      await sessionService.deleteById(sessionObject.id)
      expect(mockSessionRepository.deleteById).toHaveBeenCalled()
      expect(mockSessionRepository.deleteById).toHaveBeenCalledTimes(1)
    })
  })
})
