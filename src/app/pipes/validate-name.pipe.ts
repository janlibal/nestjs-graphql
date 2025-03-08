import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

@Injectable()
export class ValidateNamePipe implements PipeTransform {
  transform(value: any) {
    // Perform input transformations here (e.g., convert strings to lowercase)
    const transformedValue = this.transformInput(value)

    // Validate the transformed input here
    this.validateInput(transformedValue)

    return transformedValue
  }

  private transformInput(value: any) {
    // Assuming value is a string here based on your resolver
    return value.trim() // Trim spaces if necessary, or other string transformations
  }

  // Custom validation logic
  private validateInput(value: any) {
    const errors = []

    if (typeof value !== 'string') {
      errors.push('Name must be a string.')
    }

    if (value === '') {
      errors.push('Name cannot be empty.')
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '))
    }
  }
}
