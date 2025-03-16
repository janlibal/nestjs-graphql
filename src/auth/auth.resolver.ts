import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AuthEmailLoginInput } from './inputs/auth-email-login.input'
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthService } from './auth.service'
import { ValidateLoginPipe } from './pipes/validate-login.pipe'
import { ValidateRegisterPipe } from './pipes/validate-register.pipe'
import { AuthEmailRegisterInput } from './inputs/auth-email-register.input'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => LoginResponseDto)
  async login(
    @Args('input', new ValidateLoginPipe()) input: AuthEmailLoginInput,
  ): Promise<LoginResponseDto> {
    return await this.authService.validateLogin(input)
  }

  @Mutation(() => Boolean)
  async register(
    @Args('input', new ValidateRegisterPipe()) input: AuthEmailRegisterInput,
  ): Promise<boolean> {
    return await this.authService.register(input)
  }
}
