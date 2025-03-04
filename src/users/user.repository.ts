import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { PrismaService } from 'src/database/prisma.service'
import { UserMapper } from './mapper/user.mapper'
import { NullableType } from 'src/utils/types/nullable.type'
import { FilterUserInput, SortUserInput } from './inputs/query.user.input'
import { IPaginationOptions } from 'src/utils/types/pagination-options'

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
        role: true
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async findOne(id: User['id']): Promise<NullableType<UserModel>> {
    const entity = await this.prisma.user.findUnique({ where: { id }  });
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
    });
  }

  async findManyWithPagination({filterOptions,sortOptions,paginationOptions,}: {filterOptions?: FilterUserInput | null;sortOptions?: SortUserInput[] | null; paginationOptions: IPaginationOptions;}): Promise<User[]> {
    const where: FindOptionsWhere<User> = {};
    
    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: Number(role.id),
      }));
    }

    const entities = await this.prisma.user.findMany({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }
}
