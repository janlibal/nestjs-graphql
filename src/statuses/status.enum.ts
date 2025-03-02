import { registerEnumType } from '@nestjs/graphql'

export enum StatusEnum {
  active = 1,
  inactive = 2,
}

registerEnumType(StatusEnum, {
  name: 'StatusEnum',
})
