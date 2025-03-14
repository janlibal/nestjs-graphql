import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AuthEmailLoginInput } from './inputs/login-user.input'
import { LoginResponseDto } from './dto/login-response.dto'
import { AuthService } from './auth.service'
import { ValidateLoginPipe } from './pipes/validate-login.pipe'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => LoginResponseDto)
  async login(@Args('input', new ValidateLoginPipe()) input: AuthEmailLoginInput): Promise<LoginResponseDto> {
    return await this.authService.validateLogin(input)
  }
}
