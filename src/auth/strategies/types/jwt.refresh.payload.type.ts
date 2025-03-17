import { User } from '../../../users/model/user.model'
import { Session } from '../../../session/domain/session.domain'

export type JwtRefreshPayloadType = {
  userId: User['id']
  sessionId: Session['id']
  hash: Session['hash']
  iat: number
  exp: number
}
