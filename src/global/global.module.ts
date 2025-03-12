import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { AppModule } from '../app/app.module'
import { LoggerModule } from '../logger/logger.module'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from 'src/users/user.module'
import { GraphqlConfigModule } from 'src/graphql/graphql-config.module'
import { GlobalConfigModule } from 'src/config/config/global-config.module'
import { AuthModule } from 'src/auth/auth.module'
import { GqlAuthGuard } from 'src/auth/guards/gpl-auth.guard'
import { CqrsModule } from '@nestjs/cqrs'

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
    CqrsModule,
  ],
  providers: [GqlAuthGuard],
})
export class GlobalModule {}
