import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserService } from '../services/user.service';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: UpdateUserCommand) {
    const { id, name, email, password } = command;
    return this.userService.updateUser(id, name, email, password);
  }
}