import { Module } from '@nestjs/common'
import { SessionPersistence } from './persistence/session.persistence'
import { SessionRepository } from './repository/session.repository'

@Module({
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionPersistence
    }
  ],
  exports: [SessionRepository]
})
export class SessionPersistenceModule {}
