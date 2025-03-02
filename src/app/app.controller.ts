import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { AppDto } from './dto/hello.response.dto'

@Controller()
export class AppController {
  @Get('info')
  @HttpCode(HttpStatus.OK)
  public hello(): AppDto {
    const data = {
      message: 'Hello World!',
    }
    return data
  }
}
