import { Injectable } from '@nestjs/common'
import { NullableType } from 'src/utils/types/nullable.type'
import { SessionRepository } from './infrastructure/repository/session.repository'
import { Session } from './model/session.model'
import { User } from '../users/model/user.model'

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data)
  }

  deleteById(id: Session['id']): Promise<boolean> {
    return this.sessionRepository.deleteById(id)
  }

  findById(id: Session['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(id)
  }

  deleteByUserId(conditions: { userId: User['id'] }): Promise<boolean> {
    return this.sessionRepository.deleteByUserId(conditions)
  }

  update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload)
  }
  /*
  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id)
  }

  deleteByUserIdWithExclude(conditions: {
    userId: User['id']
    excludeSessionId: Session['id']
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions)
  }*/
}
