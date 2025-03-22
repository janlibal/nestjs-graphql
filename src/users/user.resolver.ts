// src/user/resolvers/user.resolver.ts

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { User as UserModel } from './model/user.model'
import { CreateUserInput } from './inputs/create.user.intput'
import { NullableType } from 'src/utils/types/nullable.type'
import { User } from '@prisma/client'
import { ValidateUserInputPipe } from './pipes/validate-user-input.pipe'
import { UserService } from './user.service'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserModel)
  async createUser(
    @Args('input', new ValidateUserInputPipe()) input: CreateUserInput,
  ): Promise<UserModel> {
    return await this.userService.createUser(input)
  }

  @Query(() => [UserModel])
  async findbyFirstNames(
    @Args('firstNames', { type: () => [String] })
    firstNames: User['firstName'][],
  ): Promise<User[]> {
    return await this.userService.getByFirstNames(firstNames)
  }

  @Query(() => [UserModel], { nullable: true })
  async findAll(): Promise<UserModel[]> {
    return await this.userService.getAll()
  }

  @Query(() => UserModel, { nullable: true })
  async findOne(
    @Args('id', { type: () => String }) id: User['id'],
  ): Promise<NullableType<UserModel>> {
    return await this.userService.findById(id)
  }
}
