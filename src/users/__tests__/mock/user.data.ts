import { CreateUserInput } from '../../inputs/create.user.intput'
import { AuthProvidersEnum } from '../../enums/auth.provider.enum'
import { User as UserDomain } from '../../model/user.model'
import { User as UserEntity } from '@prisma/client'

export const createUserInput: CreateUserInput = {
  email: 'jan.libal@janlibal.com',
  password: 'Password123!',
  firstName: 'Jan',
  lastName: 'Libal',
  role: { id: 1 },
  status: { id: 1 },
}

export const userObjectHashedPwd: UserDomain = {
  email: 'jan.libal@janlibal.com',
  password: 'hashedPassword123!',
  firstName: 'Jan',
  lastName: 'Libal',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email,
}

export const userObject: UserDomain = {
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'Passowrd123!',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email,
}

export const userMockDomainObject: UserDomain = {
  id: '1',
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'hashedPassword123!',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email,
}

export const userMockEntityObject: UserEntity = {
  id: '1',
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'hashedPassword123!',
  roleId: 1,
  statusId: 1,
  provider: AuthProvidersEnum.email,
}

const usr1: UserDomain = {
  id: '1',
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'hashedPassword123!',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email,
}

const usr2: UserDomain = {
  id: '2',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe.libal@janlibal.com',
  password: 'hashedPassword123!',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email,
}

const usr3: UserDomain = {
  id: '2',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe.libal@janlibal.com',
  password: 'hashedPassword123!',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email,
}

export const allUsers = [usr1, usr2, usr3]
