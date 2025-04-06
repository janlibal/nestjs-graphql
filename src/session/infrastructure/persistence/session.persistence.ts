import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { NullableType } from '../../../utils/types/nullable.type'
import { SessionMapper } from '../mappers/session.mapper'
import { Session } from '../../model/session.model'
import { User } from '../../../users/model/user.model'

@Injectable()
export class SessionPersistence {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Session): Promise<Session> {
    const persistenceEntity = await SessionMapper.toPersistence(data)
    const newEntity = await this.prismaService.session.create({
      data: persistenceEntity
    })
    return await SessionMapper.toDomain(newEntity)
  }

  async deleteById(id: Session['id']): Promise<boolean> {
    await this.prismaService.session.delete({ where: { id: id } })
    return true
  }

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.prismaService.session.findFirst({
      include: { user: true },
      where: { id: id }
    })
    return entity ? await SessionMapper.toDomain(entity) : null
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    await this.prismaService.session.delete({
      include: {
        user: true
      },
      where: {
        id: Number(conditions.userId)
      }
    })
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >
  ): Promise<Session | null> {
    const entity = await this.prismaService.session.findFirstOrThrow({
      where: { id: Number(id) }
    })
    if (!entity) throw new Error('Session not found')

    const sessionToUpdate = await SessionMapper.toPersistence(entity)
    const newEntity = await this.prismaService.session.update({
      include: { user: true },
      where: { id: sessionToUpdate.id },
      data: payload
    })
    return await SessionMapper.toDomain(newEntity)
    /*return await this.prismaService.session.update({
      include: {
        user: true,
      },
      where: {
        id: id, //.toString()),
      },
      data: {
        hash: payload.hash,
        user: {
          connect: {
            id: payload.userId, //.toString(),
          },
        },
      },
    })*/
  }

  /*
  async deleteByUserIdWithExclude(conditions: {
    userId: User['id']
    excludeSessionId: Session['id']
  }): Promise<void> {
    await this.prismaService.session.delete({
      include: {
        user: true,
      },
      where: {
        id: Number(conditions.userId),
      },
    })
  }*/
}
