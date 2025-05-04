import { Module } from '@nestjs/common'
import { UserRepository } from './repository/user.repository'
import { UserPersistence } from './persistence/user.persistence'

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: UserPersistence
    }
  ],
  exports: [UserRepository]
})
export class UserPersistenceModule {}
