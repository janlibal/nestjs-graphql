import { Injectable } from '@nestjs/common'
import { SessionRepository } from './session.repository'
import { Session } from './domain/session.domain'

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data as Session)
  }
}
