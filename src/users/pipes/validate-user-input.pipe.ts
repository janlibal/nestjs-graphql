import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

@Injectable()
export class ValidateUserInputPipe implements PipeTransform {
  transform(value: any) {
    // Perform input transformations here (e.g., convert strings to lowercase)
    const transformedValue = this.transformInput(value)

    // Validate the transformed input here
    this.validateInput(transformedValue)

    return transformedValue
  }

  private transformInput(value: any) {
    return {
      ...value,
      firstName: value.firstName.trim().toLowerCase(),
      lastName: value.lastName.trim().toLowerCase(),
      email: value.email.trim(),
      password: value.password.trim(),
    }
  }

  // Custom validation logic
  private validateInput(value: any) {
    const errors = []

    if (typeof value.firstName !== 'string') {
      errors.push('First name must be a string.')
    }

    if (typeof value.lastName !== 'string') {
      errors.push('Last name must be a string.')
    }

    if (typeof value.password !== 'string') {
      errors.push('Password must be a string.')
    }

    if (value.password.length < 6) {
      errors.push('Password must be at least 6 characters long.')
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

  // Simple email validation logic
  private isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    return emailRegex.test(email)
  }
}
