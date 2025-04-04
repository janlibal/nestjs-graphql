import { Injectable } from '@nestjs/common';
import { ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'nestjs-pino';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PinoLoggerService } from '../logger/adapters/pino.logger.service';

@Injectable()
export class GraphqlLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const { variables } = gqlContext.getArgs();
    const operationType = gqlContext.getContext().operationName ? 'Query' : 'Mutation'; 
    const operationName = gqlContext.getContext().req.body.operationName || 'Unnamed operation';

    this.logger.log(
      { operationName: operationName, variables },
      `Incoming GraphQL ${operationType}: ${operationName}`,
    );

    console.log('GQL Context:', gqlContext.getContext());


    return next.handle().pipe(
      tap((result) => {
        this.logger.log(
          { result },
          `GraphQL Response for ${operationName}`,
        );
      }),
    );
  }
}
