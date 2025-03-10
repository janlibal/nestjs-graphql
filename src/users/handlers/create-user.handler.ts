// src/user/handlers/create-user.handler.ts

import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserService } from '../services/user.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

  // Asynchronous execution
  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;
    return this.userService.createUser(name, email, password);  // This is async and returns a Promise
  }
}
