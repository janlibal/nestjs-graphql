import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Session {
  @Field()
  id: string

  @Field()
  hash: string
}
