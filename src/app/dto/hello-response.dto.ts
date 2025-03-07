import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HelloResponseDto {
  @Field(() => String)
  readonly message: string
}