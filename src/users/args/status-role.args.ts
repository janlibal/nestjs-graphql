import { Prisma } from '@prisma/client'

export const includeSatusAndRole = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    status: true,
    role: true
  }
})

export type StatusAndRoleEntity = Prisma.UserGetPayload<typeof includeSatusAndRole>
