// src/user/handlers/get-user.handler.ts
import { User as UserModel } from '../model/user.model'
import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { UserService } from '../services/user.service';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery): Promise<NullableType<UserModel>> {
    const { id } = query
    return await this.userService.findById(id)
  }
}
