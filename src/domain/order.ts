export type OrderStatus = 'created' | 'reserved' | 'prepared' | 'failed'

export interface OrderItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}