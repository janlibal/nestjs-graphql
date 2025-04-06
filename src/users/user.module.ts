import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserPersistenceModule } from './infrastructure/user.infrastructure.module'
import { UserResolver } from './user.resolver'

@Module({
  imports: [UserPersistenceModule],
  providers: [UserResolver, UserService],
  exports: [UserService, UserPersistenceModule]
})
export class UserModule {}
