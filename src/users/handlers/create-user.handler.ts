import { Injectable } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from '../commands/create-user.command'
import { UserService } from '../services/user.service'
import { User as UserModel } from '../model/user.model'
import { CreateUserInput } from '../inputs/create.user.intput'

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: CreateUserCommand): Promise<UserModel> {
    console.log('input ', command.input)
    const { input } = command
    return await this.userService.createUser(input)
  }
}
