import { Field, InputType } from '@nestjs/graphql'
import { Status } from './status.model'

@InputType()
export class StatusInput implements Status {
  @Field(() => Number)
  id: number
}
