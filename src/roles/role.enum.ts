import { registerEnumType } from '@nestjs/graphql'

export enum RoleEnum {
    'admin' = 1,
    'user' = 2,
  }
  
registerEnumType(RoleEnum, {
  name: 'RoleEnum',
})
