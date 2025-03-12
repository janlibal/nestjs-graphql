// src/user/resolvers/user.resolver.ts

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UpdateUserCommand } from '../commands/update-user.command';
import { GetUserQuery } from '../queries/get-user.query';
import { GetUsersQuery } from '../queries/get-users.query';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => String)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<any> {
    const result = await this.commandBus.execute(
      new CreateUserCommand(name, email, password),
    );
    return result;
  }

  @Mutation(() => String)
  async updateUser(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<any> {
    const result = await this.commandBus.execute(
      new UpdateUserCommand(id, name, email, password),
    );
    return result;
  }

  @Query(() => String)
  async getUser(@Args('id') id: string): Promise<any> {
    const result = await this.queryBus.execute(new GetUserQuery(id));
    return result;
  }

  @Query(() => [String])
  async getUsers(): Promise<any[]> {
    const result = await this.queryBus.execute(new GetUsersQuery());
    return result;
  }
}
