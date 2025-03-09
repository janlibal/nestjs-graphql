import { InputType, Field } from '@nestjs/graphql'

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
