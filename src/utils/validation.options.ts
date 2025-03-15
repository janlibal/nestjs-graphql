import { BadRequestException, ValidationPipeOptions } from '@nestjs/common'

const validationOptions: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors) => {
    const messages = errors.reduce((acc, error) => {
      if (error.constraints) {
        acc.push(...Object.values(error.constraints))
      }
      return acc
    }, [])
    return new BadRequestException(messages)
  },
}

export default validationOptions
