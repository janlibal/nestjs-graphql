import { Prisma } from '@prisma/client'

export const includeRole = {
  role: true
} satisfies Prisma.UserInclude

export const includeStatus = {
  status: true
} satisfies Prisma.UserInclude

export const includeRoleStatus = {
  ...includeRole,
  ...includeStatus
} satisfies Prisma.UserInclude
