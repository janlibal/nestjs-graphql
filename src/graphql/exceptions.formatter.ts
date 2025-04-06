import { HttpStatus } from '@nestjs/common'

export const formatGraphQLError = (error: any) => {
  const originalError = error.extensions?.originalError || {}
  const stack = error.extensions?.originalError.stack
    ? error.extensions?.originalError.stack.split('\n')
    : error.extensions?.originalError.stack

  return {
    timestamp: new Date().toISOString(),
    path: error.path,
    locations: error.locations,
    code: error.extensions?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    message: originalError.message || 'An error occurred',
    error: originalError.error || 'Unknown error',
    statusCode: originalError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,

    stack: stack.slice(0, 2)
  }
}

export const formatGraphQLError1 = (error: any) => {
  return {
    timestamp: new Date().toISOString(),
    path: error.path,
    locations: error.locations,
    code: error.extensions.status,
    message: error.extensions.originalError.message,
    error: error.extensions.originalError.error,
    statusCode: error.extensions.originalError.statusCode,
    stack: error.extensions.stacktrace.slice(0, 2)
  }
}
