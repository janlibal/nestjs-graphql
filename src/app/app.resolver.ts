import { HelloResponseDto } from './dto/hello-response.dto'
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { ValidateNamePipe } from './pipes/validate-name.pipe'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/guards/gpl-auth.guard'

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

  @UseGuards(GqlAuthGuard)
  @Query(() => HelloResponseDto)
  async hello2(
    @Args('name', ValidateNamePipe) name: String,
    @Context() context: any,
  ): Promise<HelloResponseDto> {
    const data = {
      message: 'Hello World! ' + name,
    }
    return data
  }
}
