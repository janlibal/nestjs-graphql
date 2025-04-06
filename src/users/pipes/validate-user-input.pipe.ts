import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

@Injectable()
export class ValidateUserInputPipe implements PipeTransform {
  transform(value: any) {
    const transformedValue = this.transformInput(value)
    this.validateInput(transformedValue)
    return transformedValue
  }

  private transformInput(value: any) {
    return {
      ...value,
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim().toLowerCase(),
      password: value.password.trim()
    }
  }

  private validateInput(value: any) {
    const errors = []

    if (typeof value.firstName !== 'string' || value.firstName.trim() === '') {
      errors.push('Firstname cannot be empty and must be a string.')
    }

    if (value.firstName.length < 2) {
      errors.push('Firstname must be longer than 1 character.')
    }

    if (this.isValidChars(value.firstName)) {
      errors.push('Firstname cannot contain special characters or numbers.')
    }

    if (typeof value.lastName !== 'string' || value.lastName.trim() === '') {
      errors.push('Lastname cannot be empty and must be a string.')
    }

    if (value.lastName.length < 2) {
      errors.push('Lastname must be longer than 1 character.')
    }

    if (this.isValidChars(value.lastName)) {
      errors.push('Lastname cannot contain special characters or numbers.')
    }

    if (value.password.trim() === '') {
      errors.push('Password cannot be empty.')
    }

    if (value.password.length < 6) {
      errors.push('Password must be at least 6 characters long.')
    }

    if (value.password.length > 20) {
      errors.push('Passwword can contain 20 characters at the most.')
    }

    if (!this.isPwdWeak(value.password)) {
      errors.push('Password is too weak')
    }

    if (typeof value.email === null) {
      errors.push('Email cannot be empty.')
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

  private isValidChars(name: string) {
    const invalidChars = /[^a-zA-Z\s]/
    return invalidChars.test(name)
  }

  private isPwdWeak(password: string) {
    const weakPwd = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
    return weakPwd.test(password)
  }
}
