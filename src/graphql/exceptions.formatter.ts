export const formatGraphQLError = (error: any) => {
  const stackTrace = error.extensions.stackTrace ? error.extensions.stackTrace.split('\n') : error.extensions.stackTrace
  const stack = error.stack ? error.stack.split('\n') : error.stack
  return {
    //message: 'Message from custom formatter'
    path: error.path,
    message: error.message,
    code: error.extensions?.code,
    timestamp: new Date().toISOString(),
    //details: error.extensions?.exception?.message,
    stackTrace: error.extensions?.stack
    //stack: stack && stack.length > 2 ? `${stack[0]}  ${stack[1]}` : stack,
  }
}
