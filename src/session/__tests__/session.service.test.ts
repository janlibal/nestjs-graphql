import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaModule } from '../../database/prisma.module'
import { SessionService } from '../session.service'
import { SessionRepository } from '../session.repository'
import { sessionMockDomainObject, sessionObject } from './mock/session.data'

describe('SessionService', () => {
  let sessionService: SessionService
  const mockSessionRepository = {
    create: vi.fn(),
    deleteById: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: mockSessionRepository,
        },
      ],
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
    it('create()', async () => {
      // Arrange: mock the repository's create method to resolve with sessionMockDomainObject
      mockSessionRepository.create.mockResolvedValue(sessionMockDomainObject)

      // Act: call the create method on the service
      const result = await sessionService.create(sessionObject)

      // Assert: ensure the service's result matches the mocked domain object
      expect(result).toEqual(sessionMockDomainObject)

      // Ensure the sessionRepository's create method was called with the correct argument
      expect(mockSessionRepository.create).toHaveBeenCalledWith(sessionObject)
      expect(mockSessionRepository.create).toHaveBeenCalledTimes(1)
    })
    it('deleteById()', () => {
      mockSessionRepository.deleteById.mockResolvedValue(true)
      sessionService.deleteById(sessionObject.id)
      expect(mockSessionRepository.deleteById).toHaveBeenCalled()
      expect(mockSessionRepository.deleteById).toHaveBeenCalledTimes(1)
    })
  })
})
