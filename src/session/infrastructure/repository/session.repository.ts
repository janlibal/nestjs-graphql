import { Injectable } from '@nestjs/common'
import { Session } from '../../model/session.model'
import { User } from '../../../users/model/user.model'
import { NullableType } from '../../../utils/types/nullable.type'

@Injectable()
export abstract class SessionRepository {
  abstract create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Session>

  abstract deleteById(id: Session['id']): Promise<boolean>

  abstract findById(id: Session['id']): Promise<NullableType<Session>>

  abstract deleteByUserId(conditions: { userId: User['id'] }): Promise<boolean>

  abstract update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >
  ): Promise<Session | null>
}
