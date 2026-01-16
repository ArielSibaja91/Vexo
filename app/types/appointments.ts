import type { Tables } from './database.helper'

export interface AppointmentWithDetails extends Tables<'appointments'> {
    clients: Tables<'clients'> | null
    services: Tables<'services'> | null
}