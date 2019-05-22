import './env'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const env = process.env as unknown as Environment
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {logger: false})
  app.set('x-powered-by', false);
  await app.listen(env.APP_PORT)
}

bootstrap()
