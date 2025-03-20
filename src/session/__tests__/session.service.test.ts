import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { PrismaService } from '../../database/prisma.service'
import { PrismaModule } from '../../database/prisma.module'
import { SessionService } from '../session.service'
import { SessionRepository } from '../session.repository'
import { SessionModule } from '../session.module'

// Mock Prisma Service
const mockSessionRepository = {
  create: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  waste: vi.fn(),
  deleteById: vi.fn()
}

describe('UserService', () => {
  let sessionService: SessionService
 

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
   
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sessionService).toBeDefined()
  })

  describe('SessionService methods', () => {
    it('experiment()', () => {
      mockSessionRepository.waste.mockResolvedValue('This is it')
      const result = sessionService.experiment()
      expect(result).toEqual('This is it')
      //expect(mockUserPersistence.create).toHaveBeenCalledWith({data: userMockEntityObject,})
    })

    it('deleteById()', async () => {
        //vi.spyOn(mockSessionRepository, 'deleteById').mockResolvedValue(true)
        mockSessionRepository.deleteById.mockResolvedValue(true)
        const result = await sessionService.deleteById(1)
        expect(result).toBe(true)
        expect(mockSessionRepository.deleteById).toHaveBeenCalled()
        //expect(mockSessionRepository.deleteById).toHaveBeenCalledWith(1)
        //expect(sessionService.deleteById).toHaveBeenCalledTimes(1)
    })
  })
})
