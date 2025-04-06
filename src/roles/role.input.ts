import { Field, InputType } from '@nestjs/graphql'
import { Role } from './role.model'

@InputType()
export class RoleInput implements Role {
  @Field(() => Number)
  id: number
}
