import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HelloResponseDto {
  @Field(() => String, { nullable: false })
  readonly message: string
}
