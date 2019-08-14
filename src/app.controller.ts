import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { join } from 'path'

@Controller()
export class AppController {
  @Get()
  public root(): object {
    return {
      uptime: process.uptime(),
    }
  }

  @Get('docs')
  public docs(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'docs/index.html'))
  }
}
