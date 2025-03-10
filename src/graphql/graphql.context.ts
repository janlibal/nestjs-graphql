import { Request } from 'express'

interface MyContext {
  req: Request
}

export const graphqlContext = ({ req }: { req: Request }): MyContext => {
  return {
    req,
  }
}
