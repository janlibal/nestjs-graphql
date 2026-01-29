import { CreateUserInput } from '../../inputs/create.user.intput'
import { AuthProvidersEnum } from '../../enums/auth.provider.enum'
import { User as UserDomain } from '../../model/user.model'
import { UserEntity } from '../../entities/user.entity'

export const createUserInput: CreateUserInput = {
  email: 'jan.libal@janlibal.com',
  password: 'Password123!',
  firstName: 'Jan',
  lastName: 'Libal',
  role: { id: 1 },
  status: { id: 1 }
}

export const userObjectHashedPwd: UserDomain = {
  email: 'jan.libal@janlibal.com',
  password: 'hashedPassword123!',
  firstName: 'Jan',
  lastName: 'Libal',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email
}

export const rawUserDomainObject: UserDomain = {
  id: '1',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@joedoe.com',
  password: 'hashedPassword123!',
  role: { id: 1 },
  status: { id: 1 },
  provider: AuthProvidersEnum.email
}

export const rawUserEntityObject: UserEntity = {
  id: '1',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@joedoe.com',
  password: 'hashedPassword123!',
  roleId: 1,
  statusId: 1,
  provider: AuthProvidersEnum.email
}
