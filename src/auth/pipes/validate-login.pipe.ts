import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

@Injectable()
export class ValidateLoginPipe implements PipeTransform {
  transform(value: any) {
    const transformedValue = this.transformInput(value)
    this.validateInput(transformedValue)
    return transformedValue
  }

  private transformInput(value: any) {
    return {
      ...value,
      email: value.email.trim().toLowerCase(),
      password: value.password.trim(),
    }
  }

  private validateInput(value: any) {
    const errors = []

    if (value.password.length < 1) {
      errors.push('Password cannot be empty.')
    }

    if (!this.isValidEmail(value.email)) {
      errors.push('Email is invalid.')
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '))
    }
  }

  private isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    return emailRegex.test(email)
  }
}
