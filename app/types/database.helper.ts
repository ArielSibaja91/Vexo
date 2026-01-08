import type { Database } from "./database.types";
// For reading data
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
// For inserting data
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
// For updating data
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
// For selecting or deleting single data
export type TableId<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']['id']