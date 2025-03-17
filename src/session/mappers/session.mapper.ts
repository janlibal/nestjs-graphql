import { Session as SessionEntity } from '@prisma/client'
import { Session } from '../domain/session.domain'

export class SessionMapper {
  static async toPersistence(data: Session): Promise<SessionEntity> {
    const persistenceEntity: SessionEntity = {
      id: data.id,
      hash: data.hash,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    }
    return persistenceEntity
  }

  static async toDomain(data: SessionEntity): Promise<Session> {
    const domainEntity: Session = {
      id: data.id,
      hash: data.hash,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      ...data,
    }
    return domainEntity
  }
}
