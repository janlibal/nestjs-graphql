import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'

@Injectable()
export class ValidateNamePipe implements PipeTransform {
  transform(value: any) {
    const transformedValue = this.transformInput(value)
    this.validateInput(transformedValue)
    return transformedValue
  }

  private transformInput(value: any) {
    return value.trim() 
  }

  private validateInput(value: any) {
    const errors = []

   if (typeof value !== 'string' || value.trim() === '') {
    errors.push('Name cannot be empty and must be a string.')
  }

  if (!isNaN(value)) {
    errors.push('Name cannot be a number.')
  }

  const invalidChars = /[^a-zA-Z\s]/;
  if (invalidChars.test(value)) {
    errors.push('Name cannot contain special characters or numbers.')
  }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '))
    }
  }
}