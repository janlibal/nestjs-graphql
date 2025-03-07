import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { User as UserModel } from './model/user.model'
import { CreateUserInput } from './inputs/create.user.intput'
import { NullableType } from 'src/utils/types/nullable.type'
import { PaginationArgs } from './inputs/pagination.args'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async findbyFirstNames(
    @Args('firstNames', { type: () => [String] })
    firstNames: User['firstName'][],
  ): Promise<User[]> {
    return this.userService.getByFirstNames(firstNames)
  }

  @Query(() => UserModel, { nullable: true })
  async findOne(
    @Args('id', { type: () => String }) id: User['id'],
  ): Promise<NullableType<UserModel>> {
    return this.userService.findById(id)
  }

  @Mutation(() => UserModel)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserModel> {
    return this.userService.createUser(input)
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

  /*
  @Mutation(() => UserModel)
  async optionCreateUser( @Args('input', ValidateUserInputPipe) input: CreateUserInput,): Promise<UserModel> {
    return this.userService.createUser(input)
  }
  */

  @Query(() => [UserModel], { nullable: true })
  async findAll(): Promise<UserModel[]> {
    return this.userService.getAll()
  }

  @Query(() => [UserModel])
  async findAllPaginated(
    @Args() paginationArgs: PaginationArgs,
  ): Promise<UserModel[]> {
    return this.userService.getAllPaginated(paginationArgs)
  }
}
