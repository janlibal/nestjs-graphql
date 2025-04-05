import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE "Session" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Role" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Status" RESTART IDENTITY CASCADE`,
  ])
  await prisma.status.deleteMany()
  await prisma.role.deleteMany()
  
  console.log('Seeding...')

  const role = await prisma.role.findFirst()
  if (!role) {
    await prisma.role.createMany({
      data: [
        {
          role: 'admin',
        },
        {
          role: 'user',
        },
      ],
    })
  }

  const status = await prisma.status.findFirst()
  if (!status) {
    await prisma.status.createMany({
      data: [
        {
          title: 'active',
        },
        {
          title: 'inactive',
        },
      ],
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
