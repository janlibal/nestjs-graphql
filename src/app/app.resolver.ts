import { HelloResponseDto } from './dto/hello-response.dto'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

@Resolver('App')
export class AppResolver {
  @Query(() => HelloResponseDto)
  public hello(): HelloResponseDto {
    const data = {
      message: 'Hello World!',
    }
    return data
  } 
}
