import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { AuthEmailLoginInput } from './inputs/auth-email-login.input'
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthService } from './auth.service'
import { ValidateLoginPipe } from './pipes/validate-login.pipe'
import { ValidateRegisterPipe } from './pipes/validate-register.pipe'
import { AuthEmailRegisterInput } from './inputs/auth-email-register.input'
import { NullableType } from '../utils/types/nullable.type'
import { User } from '../users/model/user.model'
import { GqlAuthGuard } from './guards/gpl-auth.guard'
import { UseGuards } from '@nestjs/common'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => LoginResponseDto)
  async login(
    @Args('input', new ValidateLoginPipe()) input: AuthEmailLoginInput
  ): Promise<LoginResponseDto> {
    return await this.authService.validateLogin(input)
  }

  @Mutation(() => Boolean)
  async register(
    @Args('input', new ValidateRegisterPipe()) input: AuthEmailRegisterInput
  ): Promise<boolean> {
    return await this.authService.register(input)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
  public me(@Context() context: any): Promise<NullableType<User>> {
    return this.authService.me(context.req.user)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    return await this.authService.logout({
      sessionId: context.req.user.sessionId,
      userId: context.req.user.id
    })
  }
}
