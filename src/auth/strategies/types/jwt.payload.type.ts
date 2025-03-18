import { User } from 'src/users/model/user.model'
import { Session } from '../../../session/model/session.model'

export type JwtPayloadType = Pick<User, 'id'> & {
  sessionId: Session['id']
  iat: number
  exp: number
}
