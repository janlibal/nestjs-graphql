export const formatGraphQLError = (error: any) => {
  const stack = error.stack ? error.stack.split('\n') : error.stack
  return {
    path: error.path,
    message: error.message,
    code: error.extensions?.code,
    timestamp: new Date().toISOString(),
    details: error.extensions?.exception?.message,
    stack: stack && stack.length > 2 ? `${stack[0]}  ${stack[1]}` : stack,
  }
}
