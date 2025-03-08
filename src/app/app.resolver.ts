import { HelloResponseDto } from './dto/hello-response.dto'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { ValidateNamePipe } from './pipes/validate-name.pipe'

@Resolver('App')
export class AppResolver {
  @Query(() => HelloResponseDto)
  async hello(
    @Args('name', ValidateNamePipe) name: String,
  ): Promise<HelloResponseDto> {
    const data = {
      message: 'Hello World! ' + name,
    }
    return data
  }
}
