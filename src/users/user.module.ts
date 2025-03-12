import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { PrismaService } from '../database/prisma.service'
import { UserService } from './services/user.service'
<<<<<<< HEAD
import { UserResolver } from './user.resolver'
import { UserRepository } from './user.repository'

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver, UserRepository, PrismaService],
=======
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
>>>>>>> 4cc21f8 (Update cqrs)
})
export class UserModule {}
