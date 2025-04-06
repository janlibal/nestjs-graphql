import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { GqlAuthGuard } from './guards/gpl-auth.guard'
import { UserModule } from '../users/user.module'
import { SessionModule } from 'src/session/session.module'

@Module({
  imports: [UserModule, SessionModule],
  providers: [AuthService, AuthResolver, GqlAuthGuard]
})
export class AuthModule {}
