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
  const originalError = error.extensions?.originalError || {}
  const rawStack = originalError.stack || error.stack || ''
  const stack = typeof rawStack === 'string' ? rawStack.split('\n').slice(0, 2) : []

  return {
    timestamp: new Date().toISOString(),
    path: error.path,
    locations: error.locations,
    requestId: error.extensions?.requestId || null,
    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    statusCode: originalError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    message: originalError.message || error.message || 'An unexpected error occurred.',
    error: originalError.error || 'Unknown error',
    stack
  }
}
