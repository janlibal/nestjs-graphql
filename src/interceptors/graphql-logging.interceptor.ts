import { Injectable } from '@nestjs/common'
import { ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PinoLoggerService } from '../logger/adapters/pino.logger.service'
import { loggingRedactPaths } from '../shared/constants/global.constants'

@Injectable()
export class GraphqlLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context)
    const { variables } = gqlContext.getArgs()
    const operationType = gqlContext.getContext().operationName
      ? 'Query'
      : 'Mutation'
    const operationName =
      gqlContext.getContext().req.body.operationName || 'Unnamed operation'

    //const sanitizedVariables = this.redactSensitiveFields({ ...variables })

    this.logger.log(
      { operationName, variables: variables },
      `Incoming GraphQL ${operationType}: ${operationName}`
    )

    return next.handle().pipe(
      tap((result) => {
        //const sanitizedResult = this.redactSensitiveFields({ ...result })

        this.logger.log(
          { result: result },
          `GraphQL Response for ${operationName}`
        )
      })
    )
  }

  private redactSensitiveFields(data: any): any {
    if (data) {
      const sensitiveFields = loggingRedactPaths

      for (const field of sensitiveFields) {
        if (data.hasOwnProperty(field)) {
          data[field] = '[REDACTED]'
        }
      }

      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => {
          data[key] = this.redactSensitiveFields(data[key])
        })
      }
    }
    return data
  }
}
