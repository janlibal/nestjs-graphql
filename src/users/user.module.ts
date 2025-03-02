import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { PrismaService } from '../database/prisma.service'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { UserRepository } from './user.repository'

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver, UserRepository, PrismaService],
})
export class UserModule {}
