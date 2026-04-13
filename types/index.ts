export type Category = 'shawarma' | 'drinks' | 'extras'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export type UserRole = 'customer' | 'admin'

export interface Profile {
  id: string
  name: string | null
  phone: string | null
  address: string | null
  role: UserRole
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: Category
  image_url: string | null
  available: boolean
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  delivery_address: string | null
  notes: string | null
  created_at: string
  order_items?: OrderItem[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
}