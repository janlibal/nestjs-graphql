import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RoleInput {
  @Field(() => Number)
  id: number
}
