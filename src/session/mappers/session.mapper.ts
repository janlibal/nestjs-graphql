import { Session as SessionEntity } from '@prisma/client'
import { Session as SessionModel} from '../model/session.model'

export class SessionMapper {
  static async toPersistence(data: SessionModel): Promise<SessionEntity> {
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

  static async toDomain(data: SessionEntity): Promise<SessionModel> {
    const domainEntity: SessionModel = {
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
