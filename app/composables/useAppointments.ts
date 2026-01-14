import type { Tables, TablesInsert } from '~/types/database.helper'

export const useAppointments = () => {
    const supabase = useSupabaseClient();
    const { profile } = useProfile();

    const appointments = useState<Tables<'appointments'>[]>('appointments-list', () => []);
    const loading = useState<boolean>('appointments-loading', () => false);

    const fetchAppointments = async (start: string, end: string) => {
        if (!profile.value?.organization_id) return;

        loading.value = true
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
        *,
        clients ( full_name, phone ),
        services ( name, duration_minutes, price )
    `)
                .eq('organization_id', profile.value.organization_id)
                .gte('start_time', start)
                .lte('start_time', end)
                .order('start_time', { ascending: true })

            if (error) throw error
            appointments.value = data || [];
        } catch (e) {
            console.error('Error fetching appointments:', e)
        } finally {
            loading.value = false
        }
    }

    const createAppointment = async (payload: TablesInsert<'appointments'>) => {
        const { data, error } = await supabase
            .from('appointments')
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        appointments.value.push(data);
        return data
    }

    return { appointments, loading, fetchAppointments, createAppointment }
}