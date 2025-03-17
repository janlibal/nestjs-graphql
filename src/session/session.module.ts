import { Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { SessionRepository } from './session.repository'
import { PrismaModule } from 'nestjs-prisma'
import { PrismaService } from '../database/prisma.service'

@Module({
  imports: [PrismaModule],
  providers: [SessionService, SessionRepository, PrismaService],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
