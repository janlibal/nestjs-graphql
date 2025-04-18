import crypto from '../../src/utils/crypto'
import { User as UserEntity } from '@prisma/client'

export const userData = {
  firstName: 'Daniel',
  lastName: 'Doe',
  email: 'daniel.doe@joedoe.com',
  password: 'Password123!',
  statusId: 1,
  roleId: 1
}

export async function prepareUser(): Promise<Omit<UserEntity, 'id' | 'provider'>> {
  return {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: await crypto.hashPassword(userData.password),
    statusId: userData.statusId,
    roleId: userData.roleId
  }
}
