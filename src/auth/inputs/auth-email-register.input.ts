import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class AuthEmailRegisterInput {
  @Field(() => String)
  firstName: string

  @Field(() => String)
  lastName: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}
