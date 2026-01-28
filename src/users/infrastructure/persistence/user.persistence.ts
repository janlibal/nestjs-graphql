import { Injectable } from '@nestjs/common'
import { User } from '../../model/user.model'
import { PrismaService } from '../../../database/prisma.service'
import { UserMapper } from '../mappers/user.mapper'
import { PaginationArgs } from '../../inputs/pagination.args'
import { NullableType } from '../../../utils/types/nullable.type'
import { UserEntity } from '../../entities/user.entity'
//import { PaginatedUsers } from './inputs/paginated.users'

@Injectable()
export class UserPersistence {
  constructor(private prisma: PrismaService) {}

  async findByFirstNames(firstNames: string[]): Promise<UserEntity[]> {
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

  async findMany(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { status: true, role: true }
    })
    return await Promise.all(
      users.map(async (userEntity) => {
        return UserMapper.toDomain(userEntity)
      })
    )
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.prisma.user.findUnique({ where: { id } })
    return entity ? UserMapper.toDomain(entity) : null
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    const entity = await this.prisma.user.findUnique({ where: { email } })
    return entity ? UserMapper.toDomain(entity) : null
  }

  async save(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data)
    const newEntity = await this.prisma.user.create({ data: persistenceModel })
    return UserMapper.toDomain(newEntity)
  }

  async findPaginated(paginationArgs: PaginationArgs): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { status: true, role: true },
      skip: (paginationArgs.page - 1) * paginationArgs.limit, // Skip (page - 1) * limit
      take: paginationArgs.limit // Limit the number of results
    })

    return await Promise.all(
      users.map(async (userEntity) => {
        return UserMapper.toDomain(userEntity)
      })
    )
  }

  async remove(id: User['id']): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: id
      }
    })
  }
}
