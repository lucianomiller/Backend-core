export interface OutboxEvent {
  id: string
  event_type: string
  payload: any
  created_at: Date
  processed: boolean
}
