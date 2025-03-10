// src/user/handlers/get-user.handler.ts

import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { UserService } from '../services/user.service';

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  // Asynchronous execution
  async execute(query: GetUserQuery): Promise<any> {
    return this.userService.getUserById(query.id);  // This is async and returns a Promise
  }
}
