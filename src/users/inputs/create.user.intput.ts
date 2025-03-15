import { InputType, Field } from '@nestjs/graphql'
import { RoleInput } from 'src/roles/role.input'
import { StatusInput } from 'src/statuses/status.input'

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

  @Field(() => RoleInput, { nullable: true })
  role?: RoleInput | null

  @Field(() => StatusInput, { nullable: true })
  status?: StatusInput | null
}
