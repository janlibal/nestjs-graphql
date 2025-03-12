import { Injectable } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { GetUsersQuery } from '../queries/get-users.query'
import { UserService } from '../services/user.service'
import { User as UserModel } from '../model/user.model'

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUsersQuery): Promise<UserModel[]> {
    return this.userService.getAll()
  }
}
