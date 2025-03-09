import { Module } from '@nestjs/common'
import { AppResolver } from './app.resolver'
import { GqlAuthGuard } from 'src/auth/guards/gpl-auth.guard'

@Module({
  providers: [AppResolver, GqlAuthGuard],
})
export class AppModule {}
