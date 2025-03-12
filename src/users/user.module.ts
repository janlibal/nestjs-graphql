import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { PrismaService } from '../database/prisma.service'
import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'
import { UserRepository } from './repositories/user.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateUserHandler } from './handlers/create-user.handler'
import { GetByNameHandler } from './handlers/get-byName.handler'
import { GetUserHandler } from './handlers/get-user.handler'
import { GetUsersHandler } from './handlers/get-users.handler'

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [UserService,UserResolver,UserRepository,PrismaService, CreateUserHandler, GetByNameHandler, GetUserHandler, GetUsersHandler
  ],
})
export class UserModule {}