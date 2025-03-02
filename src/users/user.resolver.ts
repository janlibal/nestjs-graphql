import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { CreateUserInput } from './inputs/create.user.intput'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async users() {
    return this.userService.getAll()
  }

  /*@Mutation(() => UserModel)
  async createUser(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<User> {
    return this.userService.createUser(firstName, lastName, email, password);
  }*/

  @Mutation(() => UserModel)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserModel> {
    return this.userService.createUser(input)
  }
}
