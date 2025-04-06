import { Module } from '@nestjs/common'
import { SessionPersistence } from './persistence/session.persistence'
import { PrismaModule } from '../../database/prisma.module'
import { SessionRepository } from './repository/session.repository'

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionPersistence,
    },
  ],
  exports: [SessionRepository],
})
export class SessionPersistenceModule {}
