import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { CreateUserInput } from './inputs/create.user.intput'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel], { nullable: true })
  async findAll(): Promise<User[]> {
    return this.userService.getAll()
  }

  @Query(() => [UserModel], { nullable: true })
  async findPaginated(): Promise<User[]> {
    return this.userService.getPaginated()
  }

  @Query(() => UserModel, { nullable: true })
  async findOne(@Args('id') id: string): Promise<UserModel> {
    return this.userService.findById(id);
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
