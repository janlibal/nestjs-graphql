import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { ApolloError } from 'apollo-server-express'

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Log the error for debugging purposes (you can also use a logging service)

    const stack = exception.stack
      ? exception.stack.split('\n')
      : exception.stack

    const ctx = host.switchToHttp()

    const errorObj = {
      //path: request.url,
      code: exception.extensions.code,
      timestamp: new Date().toISOString(),
      stack: stack && stack.length > 2 ? `${stack[0]}  ${stack[1]}` : stack,
    }

    console.error('EXCEPTION: ', errorObj)

    // If it's a custom ApolloError (or any specific error type)
    if (exception instanceof ApolloError) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: exception.extensions.code,
          timestamp: new Date().toISOString(),
          additionalInfo:
            exception.extensions.additionalInfo || 'Some extra info', // You can add custom fields here
        },
      })
    }

    // If it's another kind of error, you can customize it too
    return new GraphQLError('An unexpected error occurred', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR', // You can provide your own code here
      },
    })
  }
}

/*@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = exception.getResponse();
    const statusCode = exception.getStatus();

    // Return the GraphQL error response with the correct status code
    return new GraphQLError(response['message'], {
      extensions: {
        code: response['code'] || 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        statusCode: statusCode, // Send the correct status code
        details: response['message'],
      },
    });
  }
}*/
