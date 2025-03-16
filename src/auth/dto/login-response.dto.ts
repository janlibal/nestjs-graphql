import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../../users/model/user.model'

@ObjectType()
export class LoginResponseDto {
  @Field()
  token: string

  @Field()
  refreshToken: string

  @Field()
  tokenExpires: string

  @Field(() => User, { nullable: true })
  user: User
}
