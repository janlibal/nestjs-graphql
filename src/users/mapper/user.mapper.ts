import { Status } from 'src/statuses/status.model'
import { AuthProvidersEnum } from '../enums/auth.provider.enum'
import { User } from '../model/user.model'
import {
  User as UserEntity,
  ProviderEnum as Provider,
} from '@prisma/client'

export class UserMapper {
  static async toPersistence(data: User,): Promise<Omit<UserEntity, 'id'>> {
    const persistenceEntity: Omit<UserEntity, 'id'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      email: data.email,
      provider: this.mapProviderToPersistence(data.provider),
      statusId: data.status.id
    }
    return persistenceEntity
  }

  static async toDomain(raw: UserEntity): Promise<User> {
    let status: Status | undefined = undefined
    status = new Status()
    status = { id: Number(raw.statusId) }
    const domainEntity: User = {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      password: raw.password,
      email: raw.email,
      provider: this.mapProviderToDomain(raw.provider),
      status: status
    }
    return domainEntity
  }

  private static mapProviderToPersistence(
    provider: AuthProvidersEnum,
  ): Provider {
    switch (provider) {
      case AuthProvidersEnum.email:
        return Provider.email
      case AuthProvidersEnum.facebook:
        return Provider.facebook
      case AuthProvidersEnum.google:
        return Provider.google
      case AuthProvidersEnum.twitter:
        return Provider.twitter
      case AuthProvidersEnum.apple:
        return Provider.apple
    }
  }

  private static mapProviderToDomain(provider: Provider): AuthProvidersEnum {
    switch (provider) {
      case Provider.email:
        return AuthProvidersEnum.email
      case Provider.facebook:
        return AuthProvidersEnum.facebook
      case Provider.google:
        return AuthProvidersEnum.google
      case Provider.twitter:
        return AuthProvidersEnum.twitter
      case Provider.apple:
        return AuthProvidersEnum.apple
    }
  }
}
