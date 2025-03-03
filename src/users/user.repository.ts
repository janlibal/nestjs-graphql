import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { PrismaService } from 'src/database/prisma.service'
import { UserMapper } from './mapper/user.mapper'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async findOne(id: string): Promise<UserModel | null> {
    const entity = await this.prisma.user.findUnique({ where: { id }  });
    return await UserMapper.toDomain(entity)
  }

  async save(data: UserModel): Promise<UserModel> {
    const persistenceModel = await UserMapper.toPersistence(data)
    const newEntity = await this.prisma.user.create({ data: persistenceModel })
    return await UserMapper.toDomain(newEntity)
  }
}
