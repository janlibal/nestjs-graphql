<<<<<<< HEAD
// src/user/handlers/create-user.handler.ts

import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserService } from '../services/user.service';
=======
import { Injectable } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from '../commands/create-user.command'
import { UserService } from '../services/user.service'
import { User as UserModel } from '../model/user.model'
import { CreateUserInput } from '../inputs/create.user.intput'
>>>>>>> 4cc21f8 (Update cqrs)

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

<<<<<<< HEAD
  // Asynchronous execution
  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;
    return this.userService.createUser(name, email, password);  // This is async and returns a Promise
=======
  async execute(command: CreateUserCommand): Promise<UserModel> {
    console.log('input ', command.input)
    const { input } = command
    return await this.userService.createUser(input)
>>>>>>> 4cc21f8 (Update cqrs)
  }
}
