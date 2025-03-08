import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { AppModule } from '../app/app.module'
import { LoggerModule } from '../logger/logger.module'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from 'src/users/user.module'
import { GraphqlConfigModule } from 'src/graphql/graphql-config.module'
import { GlobalConfigModule } from 'src/config/config/global-config.module'

@Module({
  imports: [
    JwtModule.register({ global: true }),
    GlobalConfigModule,
    LoggerModule,
    AppModule,
    PrismaModule,
    UserModule,
    GraphqlConfigModule
  ],
})
export class GlobalModule {}
