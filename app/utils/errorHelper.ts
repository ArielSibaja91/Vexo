import { AuthError } from '@supabase/supabase-js'
import type { PostgrestError } from '@supabase/supabase-js'

export function getSupabaseErrorMessage(error: unknown): string {
    // Auth errors (Login or sign up)
    if (error instanceof AuthError) {
        return error.message
    }
    // DB errors (Postgres)
    if ((error as PostgrestError).code) {
        const pgError = error as PostgrestError
        return pgError.message
    }
    // Generic TS/JS errors
    if (error instanceof Error) {
        return error.message
    }
    // Fallback
    return 'An unexpected error ocurred'
}