import { Injectable } from '@nestjs/common'

@Injectable()
export class SessionRepository {
  async save(): Promise<string> {
    return 'Hello from session repository'
  }
}
