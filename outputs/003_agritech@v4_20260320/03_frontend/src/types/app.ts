export type Region = 'north' | 'central' | 'south'
export type ResourceType = 'machine' | 'team' | 'vehicle'
export type TimeRange = '24h' | '7d' | '30d'

export type FilterState = {
  region: Region
  resourceType: ResourceType
  timeRange: TimeRange
}

export type WorkflowNode = {
  id: string
  label: string
  x: number
  y: number
  status: 'idle' | 'running' | 'warning'
}
