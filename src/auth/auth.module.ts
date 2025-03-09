import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'

import { GqlAuthGuard } from './guards/gpl-auth.guard'

@Module({
  providers: [AuthService, AuthResolver, GqlAuthGuard],
})
export class AuthModule {}
