import { HelloResponseDto } from './dto/hello-response.dto'
import { Resolver, Query, Args } from '@nestjs/graphql'
import { ValidateNamePipe } from './pipes/validate-name.pipe'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/guards/gpl-auth.guard'
import { NotFoundException } from '@nestjs/common'

@Resolver('App')
export class AppResolver {
  @Query(() => HelloResponseDto)
  async hello(@Args('name', new ValidateNamePipe()) name: string): Promise<HelloResponseDto> {
    const data = {
      message: 'Hello World! ' + name
    }
    return data
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => HelloResponseDto)
  async hello2(
    @Args('name', new ValidateNamePipe()) name: string
    //@Context() context: any
  ): Promise<HelloResponseDto> {
    const data = {
      message: 'Hello World - ' + name
    }
    if (!data) throw new NotFoundException('Data full')
    return data
  }
}
