import { Catch, ArgumentsHost } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { ValidationError } from 'class-validator'

@Catch(ValidationError)
export class ValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: ValidationError[], host: ArgumentsHost) {
    return exception.map(
      (error) =>
        new GraphQLError(
          `Validation failed for ${error.property}: ${Object.values(error.constraints).join(', ')}`,
        ),
    )
  }
}
