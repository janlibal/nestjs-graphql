import { PrismaClient } from '@prisma/client'
import { usr } from './mock.data'

const prisma = new PrismaClient()

export default async () => {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE "Session" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`
  ])
  await prisma.$transaction([prisma.user.create({ data: usr })])
}
