// src/user/resolvers/user.resolver.ts

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from '../commands/create-user.command'
import { UpdateUserCommand } from '../commands/update-user.command'
import { GetUserQuery } from '../queries/get-user.query'
import { GetUsersQuery } from '../queries/get-users.query'
import { User as UserModel } from '../model/user.model'
import { CreateUserInput } from '../inputs/create.user.intput'
import { NullableType } from 'src/utils/types/nullable.type'
import { User } from '@prisma/client'
import { GetByNameQuery } from '../queries/get-byName.query'
import { ValidateUserInputPipe } from '../pipes/validate-user-input.pipe'

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => UserModel)
  async createUser(
    @Args('input', new ValidateUserInputPipe()) input: CreateUserInput,
  ): Promise<UserModel> {
    return this.commandBus.execute(new CreateUserCommand(input))
  }

  @Query(() => [UserModel])
  async findbyFirstNames(
    @Args('firstNames', { type: () => [String] })
    firstNames: User['firstName'][],
  ): Promise<User[]> {
    return await this.queryBus.execute(new GetByNameQuery(firstNames))
  }

  @Query(() => [UserModel], { nullable: true })
  async findAll(): Promise<UserModel[]> {
    return await this.queryBus.execute(new GetUsersQuery())
  }

  @Query(() => UserModel, { nullable: true })
  async findOne(
    @Args('id', { type: () => String }) id: User['id'],
  ): Promise<NullableType<UserModel>> {
    return await this.queryBus.execute(new GetUserQuery(id))
  }
}
