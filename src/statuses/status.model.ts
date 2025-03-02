import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Status {
  @Field(() => Number)
  id?: number

  @Field(() => String)
  title?: string
}
