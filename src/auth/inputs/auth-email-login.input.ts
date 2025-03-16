import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class AuthEmailLoginInput {
  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}
