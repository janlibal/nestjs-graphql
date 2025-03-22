import { Test, TestingModule } from '@nestjs/testing'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { JwtService } from '@nestjs/jwt'
import { PrismaModule } from '../../database/prisma.module'
import { UserResolver } from '../resolvers/user.resolver'
import { UserService } from '../services/user.service'

const mockUserService = {
  register: vi.fn(),
  validateLogin: vi.fn(),
}

describe('UserResolver', () => {
  let userResolver: UserResolver
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        
        PrismaModule,
        
      ],
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        JwtService,
      ],
    }).compile()

    userResolver = module.get<UserResolver>(UserResolver)
    userService = module.get<UserService>(UserService)

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userResolver).toBeDefined()
  })
})
