import { AuthEmailLoginInput } from '../../inputs/auth-email-login.input'
import { AuthProvidersEnum } from '../../../users/enums/auth.provider.enum'
import { AuthEmailRegisterInput } from '../../inputs/auth-email-register.input'
import { User as UserEntity } from '@prisma/client'
import { LoginResponseDto } from '../../dto/login-response.dto'

export const registerInput: AuthEmailRegisterInput = {
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'Password123!'
}

export const loginData: AuthEmailLoginInput = {
  email: 'jan.libal@janlibal.com',
  password: 'Password123!'
}

export const loginDataBad: AuthEmailLoginInput = {
  email: 'jan.libal@janlibal.com',
  password: 'Pass'
}

export const mockUserGoogle: UserEntity = {
  id: 'fd4e8fb7-818d-4e1c-adba-920e13bc2d76',
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'Password123!',
  statusId: 1,
  roleId: 1,
  provider: AuthProvidersEnum.google
}

export const mockUser: UserEntity = {
  id: 'fd4e8fb7-818d-4e1c-adba-920e13bc2d76',
  firstName: 'Jan',
  lastName: 'Libal',
  email: 'jan.libal@janlibal.com',
  password: 'Password123!',
  statusId: 1,
  roleId: 1,
  provider: AuthProvidersEnum.email
}

export const sessionData = {
  userId: mockUser.id,
  hash: 'hash123'
}

export const mockLoginResponse: LoginResponseDto = {
  token: 'token',
  refreshToken: 'refreshToken',
  tokenExpires: '1234567890',
  user: {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    password: mockUser.password,
    provider: AuthProvidersEnum.email,
    status: { id: mockUser.statusId },
    role: { id: mockUser.roleId }
  }
}
