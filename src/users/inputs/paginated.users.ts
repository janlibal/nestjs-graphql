import { Field, Int, ObjectType } from '@nestjs/graphql'
import { User } from '@prisma/client'
import { User as UserModel } from '../model/user.model'

@ObjectType()
export class PaginatedUsers {
  @Field(() => [UserModel])
  data: UserModel[]

  @Field(() => Int)
  totalCount: number
}
