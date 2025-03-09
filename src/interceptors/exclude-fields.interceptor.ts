// auth/interceptors/exclude-fields.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fieldsToExclude: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          // Remove the specified fields from the response object
          this.fieldsToExclude.forEach((field) => {
            if (data.hasOwnProperty(field)) {
              delete data[field]
            }
          })
        }
        return data
      }),
    )
  }
}
