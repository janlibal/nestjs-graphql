import crypto from '../../src/utils/crypto'

export const usr = {
  firstName: 'Daniel',
  lastName: 'Doe',
  password: crypto.hashPassword('Password123!'),
  email: 'daniel.doe@joedoe.com',
  statusId: 1,
  roleId: 1
}
