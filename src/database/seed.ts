import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.status.deleteMany()
  console.log('Seeding...')

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
