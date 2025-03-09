// graphql-config.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import appConfig from 'src/app/config/app.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
  ],
  exports: [ConfigModule],
})
export class GlobalConfigModule {}
