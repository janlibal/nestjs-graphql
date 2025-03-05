import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { PrismaService } from 'src/database/prisma.service'
import { UserMapper } from './mapper/user.mapper'
import { NullableType } from 'src/utils/types/nullable.type'
import {
  PaginateOutput,
  paginate,
  paginateOutput,
} from 'src/utils/pagination-utils'
import { QueryPaginationDto } from './inputs/query-pagination.dto'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByFirstNames(firstNames: string[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        firstName: {
          in: firstNames,
        },
      },
      include: {
        status: true,
        role: true,
      },
    })
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async findOne(id: User['id']): Promise<NullableType<UserModel>> {
    const entity = await this.prisma.user.findUnique({ where: { id } })
    return await UserMapper.toDomain(entity)
  }

  async save(data: UserModel): Promise<UserModel> {
    const persistenceModel = await UserMapper.toPersistence(data)
    const newEntity = await this.prisma.user.create({ data: persistenceModel })
    return await UserMapper.toDomain(newEntity)
  }

  async findPaginated(page: number, pageSize: number): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  }

  async findUsersWithPagination(
    query?: QueryPaginationDto,
  ): Promise<PaginateOutput<User>> {
    const [posts, total] = await Promise.all([
      await this.prisma.user.findMany({
        ...paginate(query),
      }),
      await this.prisma.user.count(),
    ])

    return paginateOutput<User>(posts, total, query)
  }
}
