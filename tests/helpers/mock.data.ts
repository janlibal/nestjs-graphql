import crypto from '../../src/utils/crypto'

export const usr = {
  firstName: 'Daniel',
  lastName: 'Doe',
  password: await crypto.hashPassword('Password123!'),
  email: 'daniel.doe@joedoe.com',
  statusId: 1,
  roleId: 1,
}
