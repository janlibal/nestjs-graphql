import { Injectable } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { UserService } from '../services/user.service'
import { GetByNameQuery } from '../queries/get-byName.query'
import { User } from '@prisma/client'

@Injectable()
@QueryHandler(GetByNameQuery)
export class GetByNameHandler implements IQueryHandler<GetByNameQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetByNameQuery): Promise<User[]> {
    const { firstNames } = query
    return await this.userService.getByFirstNames(firstNames)
  }
}
