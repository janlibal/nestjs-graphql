import { Injectable } from '@nestjs/common'
import { SessionMapper } from './mappers/session.mapper'
import { PrismaService } from '../database/prisma.service'
import { Session } from './model/session.model'
import { NullableType } from '../utils/types/nullable.type'
import { User } from '../users/model/user.model'


@Injectable()
export class SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Session): Promise<Session> {
    const persistenceEntity = await SessionMapper.toPersistence(data)
    const newEntity = await this.prismaService.session.create({
      data: persistenceEntity,
    })
    return await SessionMapper.toDomain(newEntity)
  }

  async deleteById(id: Session['id']): Promise<boolean> {
    const data = this.prismaService.session.delete({ where: { id: id } })
    return true
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    await this.prismaService.session.delete({
      include: {
        user: true,
      },
      where: {
        id: Number(conditions.userId),
      },
    })
  }

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.prismaService.session.findFirst({
      include: { user: true },
      where: { id: id },
    })
    return entity ? await SessionMapper.toDomain(entity) : null
  }

  waste(): string {
    return 'This is it'
  }
}
