import { Request } from 'express'
import { ReqId } from 'pino-http'

interface MyContext {
  req: Request
  requestId: ReqId
}

export const graphqlContext = ({ req }: { req: Request }): MyContext => {
  return {
    req,
    requestId: req.id
  }
}
