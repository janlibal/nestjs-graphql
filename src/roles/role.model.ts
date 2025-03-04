import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Role {
  @Field(() => Number)
  id?: number

  @Field(() => String)
  name?: string
}
