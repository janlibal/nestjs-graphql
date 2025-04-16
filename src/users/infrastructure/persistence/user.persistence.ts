import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { User as UserModel } from '../../model/user.model'
import { PrismaService } from '../../../database/prisma.service'
import { UserMapper } from '../mappers/user.mapper'
import { PaginationArgs } from '../../inputs/pagination.args'
import { NullableType } from '../../../utils/types/nullable.type'
//import { PaginatedUsers } from './inputs/paginated.users'

@Injectable()
export class UserPersistence {
  constructor(private prisma: PrismaService) {}

  async findByFirstNames(firstNames: string[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        firstName: {
          in: firstNames
        }
      },
      include: {
        status: true,
        role: true
      }
    })
  }

  async findMany(): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      include: { status: true, role: true }
    })
    return await Promise.all(
      users.map(async (userEntity) => {
        return await UserMapper.toDomain(userEntity)
      })
    )
  }

  async findById(id: UserModel['id']): Promise<NullableType<UserModel>> {
    const entity = await this.prisma.user.findUnique({ where: { id } })
    return entity ? UserMapper.toDomain(entity) : null
  }

  async findByEmail(email: UserModel['email']): Promise<NullableType<UserModel>> {
    const entity = await this.prisma.user.findUnique({ where: { email } })
    return entity ? UserMapper.toDomain(entity) : null
  }

  async save(data: UserModel): Promise<UserModel> {
    const persistenceModel = await UserMapper.toPersistence(data)
    const newEntity = await this.prisma.user.create({ data: persistenceModel })
    return await UserMapper.toDomain(newEntity)
  }

  async findPaginated(paginationArgs: PaginationArgs): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      include: { status: true, role: true },
      skip: (paginationArgs.page - 1) * paginationArgs.limit, // Skip (page - 1) * limit
      take: paginationArgs.limit // Limit the number of results
    })

    return await Promise.all(
      users.map(async (userEntity) => {
        return await UserMapper.toDomain(userEntity)
      })
    )
  }

  async remove(id: UserModel['id']): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: id
      }
    })
  }
}
