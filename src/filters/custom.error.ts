import { ApolloError } from 'apollo-server-express'

export class CustomGraphQLError extends ApolloError {
  constructor(message: string, code: string) {
    super(message, code)
  }
}
