import { ExecutionContext, CallHandler, NestInterceptor, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PinoLoggerService } from '../logger/adapters/pino.logger.service'
import { sensitiveKeys } from '../shared/constants/global.constants'

@Injectable()
export class GraphqlLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context)
    const { variables } = gqlContext.getArgs()

    const req = gqlContext.getContext().req
    const body = req.body.query
    const operationName = this.getOperationName(body)
    const operationType =
      body && body.toLowerCase().trim().startsWith('mutation') ? 'Mutation' : 'Query'
    const operation = operationName || 'Unnamed operation'

    const requestId = req?.id || 'No ID'

    // FIXME: Further investigate variables!
    //console.log('Incoming GraphQL Request:', gqlContext.getContext())

    this.logger.log(
      {
        requestId,
        operationName: operation,
        vars: variables,
        variables: this.redactSensitiveFields(variables)
      },
      `Incoming GraphQL ${operationType}: ${operationName}`
    )

    return next.handle().pipe(
      tap((result) => {
        const sanitizedResult = this.redactSensitiveFields(result)

        this.logger.log(
          {
            requestId,
            result: sanitizedResult
          },
          `GraphQL Response for ${operationName}`
        )
      })
    )
  }

  private getOperationName(data: string) {
    const query = data.split(/\s+/)
    const stringData = query[2]
    const result = stringData.split('('[0])
    return result[0]
  }

  private redactSensitiveFields(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.redactSensitiveFields(item))
    }

    if (typeof data === 'object' && data !== null) {
      const redacted: any = {}
      for (const key in data) {
        if (sensitiveKeys.includes(key)) {
          redacted[key] = '[REDACTED]'
        } else {
          redacted[key] = this.redactSensitiveFields(data[key])
        }
      }
      return redacted
    }

    return data
  }
}
