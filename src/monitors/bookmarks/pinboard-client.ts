import { Injectable } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import { VError } from 'verror'

import { Bookmark } from './bookmark'
import { EnvironmentProvider } from '../../environment/environment.provider'
import { Http } from '../../http/http'

@Injectable()
export class PinboardClient {
  public constructor(
    private readonly env: EnvironmentProvider,
    private readonly http: Http,
  ) {}

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
      throw new VError(error, 'failed to get all Pinboard bookmarks')
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
        auth_token: this.env.get('TOKEN_PINBOARD'),
        format: 'json',
        ...(overrides.params || {}),
      },
    }
  }
}
