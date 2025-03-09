import { User } from '../../users/model/user.model'
import { AuthProvidersEnum } from 'src/users/enums/auth.provider.enum'

export const fakeUser: User = {
  id: '6b186c52-19c0-452e-9922-4c2bc4fa05e0',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe.doe@joedoe.com',
  password: 'Password123!',
  provider: AuthProvidersEnum.facebook,
  status: {
    id: 2,
  },
  role: {
    id: 2,
  },
}
