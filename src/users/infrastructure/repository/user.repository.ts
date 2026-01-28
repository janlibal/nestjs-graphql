import { User as UserModel } from '../../model/user.model'
import { NullableType } from '../../../utils/types/nullable.type'
import { PaginationArgs } from '../../inputs/pagination.args'
import { UserEntity } from '../../entities/user.entity'

export abstract class UserRepository {
  abstract save(
    data: Omit<UserModel, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>
  ): Promise<UserModel>

  abstract findByEmail(email: UserModel['email']): Promise<NullableType<UserModel>>

  abstract findById(id: UserModel['id']): Promise<NullableType<UserModel>>

  abstract findMany(): Promise<UserModel[]>

  abstract findByFirstNames(firstNames: string[]): Promise<UserEntity[]>

  abstract findPaginated(paginationArgs: PaginationArgs): Promise<UserModel[]>

  abstract remove(id: UserModel['id']): Promise<void>
}
