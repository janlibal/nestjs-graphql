import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { Logger } from '@nestjs/common'
import { HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const info = gqlHost.getInfo()

    // Default status code is 500 (Internal Server Error)
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message = exception.message || 'Internal server error'

    // Check if the exception is an instance of a NestJS HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      message = exception.message
    } else {
      // If the exception isn't an instance of HttpException, check its type manually
      if (exception.name === 'BadRequestException') {
        statusCode = HttpStatus.BAD_REQUEST
        message = 'Bad Request'
      } else if (exception.name === 'UnauthorizedException') {
        statusCode = HttpStatus.UNAUTHORIZED
        message = 'Unauthorized'
      }
    }

    // Log the error
    Logger.error(
      `${info.parentType.name} ${info.fieldName}`,
      exception.stack,
      'GraphQL ExceptionFilter'
    )

    // Format the error response
    const formattedError = {
      statusCode,
      message,
      type: info.parentType.name,
      field: info.fieldName
    }

    // Throw a GraphQLError with the formatted error
    throw new GraphQLError(message, {
      extensions: {
        status: statusCode,
        originalError: exception
      }
    })
  }
}
