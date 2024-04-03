export interface Order {
    id: string
    buyerId: string
    shippingAddress: ShippingAddress
    orderDate: string
    orderItems: OrderItem[]
    subtotal: number
    deliveryFee: number
    orderStatus: string
    total: number
  }
  
  export interface ShippingAddress {
    id: string
    fullName: string
    address1: string
    address2: string
    city: string
    state: string
    zip: string
    country: string
  }
  
  export interface OrderItem {
    productId: string
    name: string
    pictureUrl: string
    price: number
    quantity: number
  }