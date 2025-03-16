import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import appConfig from 'src/app/config/app.config'
import authConfig from 'src/auth/config/auth.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      envFilePath: ['.env'],
    }),
  ],
  exports: [ConfigModule],
})
export class GlobalConfigModule {}
