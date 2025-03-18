import { User } from '../../../users/model/user.model'
import { Session } from '../../../session/model/session.model'

export type JwtRefreshPayloadType = {
  userId: User['id']
  sessionId: Session['id']
  hash: Session['hash']
  iat: number
  exp: number
}
