import crypto from '../../src/utils/crypto'
import { User as UserEntity } from '@prisma/client'

export async function prepareUser(): Promise<Omit<UserEntity, 'id' | 'provider'>> {
  return {
    firstName: 'Daniel',
    lastName: 'Doe',
    email: 'daniel.doe@joedoe.com',
    password: await crypto.hashPassword('Password123!'),
    statusId: 1,
    roleId: 1
  }
}
