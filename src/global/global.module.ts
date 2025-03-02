import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import { AppModule } from '../app/app.module'
import appConfig from '../app/config/app.config'
import { LoggerModule } from '../logger/logger.module'
import { JwtModule } from '@nestjs/jwt'
import { join } from 'path'
import { GraphQLModule } from '@nestjs/graphql'
import { UserModule } from 'src/users/user.module'
import { ApolloDriver } from '@nestjs/apollo'

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    LoggerModule,
    AppModule,
    PrismaModule,
    UserModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // This enables the GraphQL playground for easy testing
      //playground: process.env.NODE_ENV !== 'prod',
    }),
  ],
})
export class GlobalModule {}
