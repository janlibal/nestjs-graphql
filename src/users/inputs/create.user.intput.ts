import { InputType, Field } from '@nestjs/graphql'
import { AuthProvidersEnum } from '../enums/auth.provider.enum'

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  password: string

  @Field()
  email: string
}
