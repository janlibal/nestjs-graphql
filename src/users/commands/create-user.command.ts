import { CreateUserInput } from '../inputs/create.user.intput'

export class CreateUserCommand {
  constructor(public readonly input: CreateUserInput) {}
}
