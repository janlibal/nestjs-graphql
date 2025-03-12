import { User } from '@prisma/client'

export class GetByNameQuery {
  constructor(public readonly firstNames: User['firstName'][]) {}
}
