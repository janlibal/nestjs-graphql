import { User as UserDomain } from '../../model/user.model'
import { User as UserEntity } from '@prisma/client'

export function userMockDomainObjects(rawUsr: UserDomain, numObjects: number) {
  const userArray = []

  for (let i = 0; i < numObjects; i++) {
    const newUser: UserDomain = {
      id: (parseInt(rawUsr.id) + i).toString(),
      firstName: rawUsr.firstName + `${i}`,
      lastName: rawUsr.lastName,
      email: `joe${i}.doe@joedoe.com`,
      password: rawUsr.password,
      role: { id: rawUsr.role.id },
      status: { id: rawUsr.status.id },
      provider: rawUsr.provider,
    }
    userArray.push(newUser)
  }

  return userArray
}

export function userMockEntityObjects(rawUsr: UserEntity, numObjects: number) {
  const userArray = []

  for (let i = 0; i < numObjects; i++) {
    const newUser: UserEntity = {
      id: (parseInt(rawUsr.id) + i).toString(),
      firstName: rawUsr.firstName + `${i}`,
      lastName: rawUsr.lastName,
      email: `joe${i}.doe@joedoe.com`,
      password: rawUsr.password,
      roleId: rawUsr.roleId,
      statusId: rawUsr.statusId,
      provider: rawUsr.provider,
    }
    userArray.push(newUser)
  }

  return userArray
}
