export interface ServerStatusBucket {
  name: string
  size_bytes: number
  size_human: string
  file_count: number
}

export interface ServerStatusTable {
  name: string
  size_bytes: number
  size_human: string
  row_estimate: number
}

export interface ServerStatus {
  database: {
    size_bytes: number
    size_human: string
    active_connections: number
    max_connections: number
    uptime_since: string
    cache_hit_ratio: number
  }
  storage: {
    total_bytes: number
    total_human: string
    buckets: ServerStatusBucket[]
  }
  tables: ServerStatusTable[]
  timestamp: string
}
