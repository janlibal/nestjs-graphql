import { SessionEntity } from '../../entities/session.entity'
import { Session } from '../../model/session.model'

export class SessionMapper {
  static toPersistence(data: Session): SessionEntity {
    const persistenceEntity: SessionEntity = {
      id: data.id,
      hash: data.hash,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt
    }
    return persistenceEntity
  }

  static toDomain(data: SessionEntity): Session {
    const domainEntity: Session = {
      id: data.id,
      hash: data.hash,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      ...data
    }
    return domainEntity
  }
}
