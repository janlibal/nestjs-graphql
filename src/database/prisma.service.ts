import { OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { connectWithRetry } from './prisma.connection-checker'

export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await connectWithRetry()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
