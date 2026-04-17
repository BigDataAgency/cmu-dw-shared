import { get } from './fetch'
import type { ServerStatus } from '../types/server-status'

export const serverStatusApi = {
  get: (): Promise<ServerStatus> =>
    get('/server-status'),
}
