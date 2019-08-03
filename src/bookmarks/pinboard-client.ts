import { Injectable } from '@nestjs/common'

import { Bookmark } from './bookmark'
import { EnvironmentProvider } from '../environment/environment.provider'
import { Http } from '../http/http'
import { LogFactory, Logger } from '../logger/log-factory'
import { AxiosRequestConfig } from 'axios'

@Injectable()
export class PinboardClient {
  private readonly log: Logger

  public constructor(
    private readonly env: EnvironmentProvider,
    private readonly http: Http,
    log: LogFactory,
  ) {
    this.log = log.child('PinboardClient')
  }

  public async getAll(from?: Date): Promise<Bookmark[]> {
    const config: AxiosRequestConfig = {}
    if (from !== undefined) {
      config.params = {
        fromdt: from.toISOString(),
      }
    }

    try {
      const { data: bookmarks } = await this.http.get<Bookmark[]>(
        this.buildUrl('posts/all'),
        this.buildConfig(config),
      )
      return bookmarks
    } catch (error) {
      this.log.error({ err: error })
      throw new Error('failed to get all Pinboard bookmarks')
    }
  }

  private buildUrl(
    endpoint: 'posts/all' | 'posts/get' | 'posts/recent' | 'posts/dates',
  ): string {
    return `https://api.pinboard.in/v1/${endpoint}`
  }

  private buildConfig(overrides: Partial<AxiosRequestConfig> = {}): AxiosRequestConfig {
    return {
      ...overrides,
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        auth_token: this.env.get('TOKEN_PINBOARD'),
        format: 'json',
        ...(overrides.params || {}),
      },
    }
  }
}
