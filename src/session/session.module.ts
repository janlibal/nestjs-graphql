import { Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { SessionPersistenceModule } from './infrastructure/session.infrastructure.module'

@Module({
  imports: [SessionPersistenceModule],
  providers: [SessionService],
  exports: [SessionService, SessionPersistenceModule],
})
export class SessionModule {}
