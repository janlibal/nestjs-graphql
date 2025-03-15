export const formatGraphQLError = (error: any) => {
  return {
    timestamp: new Date().toISOString(),
    path: error.path,
    locations: error.locations,
    code: error.extensions.status,
    message: error.extensions.originalError.message,
    error: error.extensions.originalError.error,
    statusCode: error.extensions.originalError.statusCode,
    stack: error.extensions.stacktrace.slice(0, 2),
  }
}
