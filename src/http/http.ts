import { Injectable } from '@nestjs/common'
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'

import { LogFactory, Logger } from '../logger/log-factory'

@Injectable()
export class Http {
  private readonly log: Logger
  private readonly axios: AxiosInstance
  private static readonly axiosConfig: AxiosRequestConfig = {
    // Fifteen seconds
    timeout: 15000,
  }

  public constructor(log: LogFactory) {
    this.log = log.child('Http')
    this.axios = Axios.create(Http.axiosConfig)
  }

  public get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.logRequest('get', url, config)
    return this.axios.get<T>(url, config)
  }

  public delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.logRequest('delete', url, config)
    return this.axios.delete(url, config)
  }

  public head<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.logRequest('head', url, config)
    return this.axios.head(url, config)
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.logRequest('post', url, config, data)
    return this.axios.post(url, data, config)
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.logRequest('put', url, config, data)
    return this.axios.put(url, data, config)
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.logRequest('patch', url, config, data)
    return this.axios.patch(url, data, config)
  }

  private logRequest(
    method: Method,
    url: string,
    config?: AxiosRequestConfig,
    data?: unknown,
  ): void {
    this.log.trace({ url, config, data }, '%s request to %s', method.toUpperCase(), url)
  }
}
