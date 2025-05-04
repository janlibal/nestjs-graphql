import { Module } from '@nestjs/common'
import { AppModule } from '../app/app.module'
import { LoggerModule } from '../logger/logger.module'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../users/user.module'
import { GraphqlConfigModule } from '../graphql/graphql-config.module'
import { GlobalConfigModule } from '../config/global-config.module'
import { AuthModule } from '../auth/auth.module'
import { GqlAuthGuard } from '../auth/guards/gpl-auth.guard'
import { RedisModule } from '../redis/redis.module'
import { SessionModule } from 'src/session/session.module'
import { PrismaModule } from '../database/prisma.module'

@Module({
  imports: [
    JwtModule.register({ global: true }),
    GlobalConfigModule,
    LoggerModule,
    AppModule,
    PrismaModule,
    UserModule,
    GraphqlConfigModule,
    AuthModule,
    RedisModule,
    SessionModule
  ],
  providers: [GqlAuthGuard]
})
export class GlobalModule {}
