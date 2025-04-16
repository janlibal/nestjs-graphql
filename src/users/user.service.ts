import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { AuthProvidersEnum } from './enums/auth.provider.enum'
import { CreateUserInput } from './inputs/create.user.intput'
import { StatusEnum } from '../statuses/status.enum'
import { NullableType } from '../utils/types/nullable.type'
import { RoleEnum } from '../roles/role.enum'
import { PaginationArgs } from './inputs/pagination.args'
import crypto from '../utils/crypto'
import { Role } from '../roles/role.model'
import { Status } from '../statuses/status.model'
import { UserRepository } from './infrastructure/repository/user.repository'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getByFirstNames(firstNames: string[]): Promise<User[]> {
    return await this.userRepository.findByFirstNames(firstNames)
  }

  async getAll(): Promise<UserModel[]> {
    return await this.userRepository.findMany()
  }

  findById(id: User['id']): Promise<NullableType<UserModel>> {
    const data = this.userRepository.findById(id)
    if (!data) throw new UnprocessableEntityException('No user found')
    return data
  }

  async findByEmail(email: User['email']): Promise<NullableType<UserModel>> {
    return await this.userRepository.findByEmail(email)
  }

  async createUser(createUserInput: CreateUserInput): Promise<UserModel> {
    let email: string | null = null
    if (createUserInput.email) {
      const userObject = await this.userRepository.findByEmail(createUserInput.email)
      if (userObject) {
        throw new ConflictException('User already exists')
      }
      email = createUserInput.email
    }

    let password: string | undefined = undefined
    if (createUserInput.password) {
      password = await crypto.hashPassword(createUserInput.password)
    }

    let role: Role | undefined = undefined
    const roleObject = Object.values(RoleEnum).map(String).includes(String(createUserInput.role.id))
    if (!roleObject) {
      throw new UnprocessableEntityException('Role does not exist')
    }
    role = { id: createUserInput.role.id }

    let status: Status | undefined = undefined
    const statusObject = Object.values(StatusEnum)
      .map(String)
      .includes(String(createUserInput.status.id))
    if (!statusObject) {
      throw new UnprocessableEntityException('Status does not exist')
    }
    status = { id: createUserInput.role.id }

    const clonedPayload: UserModel = {
      firstName: createUserInput.firstName,
      lastName: createUserInput.lastName,
      password: password,
      email: email,
      provider: AuthProvidersEnum.email,
      role: role,
      status: status
    }
    return await this.userRepository.save(clonedPayload)
  }

  async getAllPaginated(paginationArgs: PaginationArgs): Promise<UserModel[]> {
    return await this.userRepository.findPaginated(paginationArgs)
  }
}
