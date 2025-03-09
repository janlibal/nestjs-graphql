import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class AuthEmailLoginInput {
  @Field(() => String, { nullable: true })
  password: string

  @Field(() => String, { nullable: true })
  email: string
}
