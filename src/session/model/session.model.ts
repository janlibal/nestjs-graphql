import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Session {
  @Field()
  id: number

  @Field()
  hash: string

  @Field()
  userId: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  deletedAt: Date
}
