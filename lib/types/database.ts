// Database types for NuelReserve
export type UserRole = "user" | "provider"

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  user_role: UserRole
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  provider_id: string
  title: string
  description: string | null
  category: string
  duration_minutes: number
  price: number
  location: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Availability {
  id: string
  service_id: string
  provider_id: string
  date: string
  start_time: string
  end_time: string
  is_booked: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  provider_id: string
  availability_id: string
  booking_date: string
  start_time: string
  end_time: string
  status: BookingStatus
  total_price: number
  notes: string | null
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface ServiceWithProvider extends Service {
  provider: Profile
}

export interface BookingWithDetails extends Booking {
  service: Service
  provider: Profile
}
