import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'
import { EnvironmentProvider } from './environment/environment.provider'
import { LogFactory } from './logger/log-factory'
import { NestLogger } from './logger/nest-logger'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {logger: false})
  app.useLogger(app.get(NestLogger))
  app.useStaticAssets(__dirname)
  app.set('x-powered-by', false);

  const log = app.get(LogFactory).child('bootstrap')
  const env = app.get(EnvironmentProvider)
  try {
    env.validate()
  } catch (error) {
    log.fatal(error)
    process.exit(1)
  }
  await app.listen(env.get('APP_PORT'))
}

bootstrap()
