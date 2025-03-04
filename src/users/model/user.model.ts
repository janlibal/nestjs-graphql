import { Field, ObjectType } from '@nestjs/graphql'
import { AuthProvidersEnum } from '../enums/auth.provider.enum'
import { Status } from '../../statuses/status.model'
import { Role } from '../../roles/role.model'

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

  @Field(() => Status, {nullable:true})
  status: Status

  @Field(() => Role, {nullable:true})
  role: Role
}
