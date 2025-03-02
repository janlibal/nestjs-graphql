import { Field, ObjectType } from '@nestjs/graphql'
import { AuthProvidersEnum } from '../enums/auth.provider.enum'
import { Status } from '../../statuses/status.model'

@ObjectType()
export class User {
  @Field(() => String)
  id?: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  password: string

  @Field()
  email: string

  @Field()
  provider: AuthProvidersEnum

  @Field(() => Status)
  status: Status;
}
