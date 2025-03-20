import { Injectable } from '@nestjs/common'
import { SessionRepository } from './session.repository'
import { Session } from './model/session.model'

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data as Session)
  }

  deleteById(id: Session['id']): Promise<boolean> {
    return this.sessionRepository.deleteById(id)
  }

  experiment(): string {
    return this.sessionRepository.waste()
  }
}
