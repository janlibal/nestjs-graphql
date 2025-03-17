import { Injectable } from '@nestjs/common'
import { SessionRepository } from './session.repository'

@Injectable()
export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}
  async session(): Promise<string> {
    return await this.sessionRepository.save()
  }
}
