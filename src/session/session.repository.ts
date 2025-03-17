import { Injectable } from '@nestjs/common'
import { SessionMapper } from './mappers/session.mapper'
import { PrismaService } from '../database/prisma.service'
import { Session } from './domain/session.domain'

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
}
