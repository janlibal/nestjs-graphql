import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { UserRepository } from './user.repository'
import { AuthProvidersEnum } from './enums/auth.provider.enum'
import { CreateUserInput } from './inputs/create.user.intput'
import { StatusEnum } from '../../src/statuses/status.enum'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAll(): Promise<User[]> {
    return await this.userRepository.findAll()
  }

  async findById(id: string): Promise<UserModel> {
    return await this.userRepository.findOne(id)
  }

  async createUser(createUserInput: CreateUserInput): Promise<UserModel> {
    const clonedPayload: UserModel = {
      firstName: createUserInput.firstName,
      lastName: createUserInput.lastName,
      password: createUserInput.password,
      email: createUserInput.email,
      provider: AuthProvidersEnum.facebook,
      status: {
        id: StatusEnum.inactive,
      },
    }
    return await this.userRepository.save(clonedPayload)
  }
}
