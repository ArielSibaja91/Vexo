import type { Tables, TablesInsert } from '~/types/database.helper'

export const useAppointments = () => {
    const supabase = useSupabaseClient();
    const { profile } = useProfile();

    const appointments = useState<Tables<'appointments'>[]>('appointments-list', () => []);
    const loading = useState<boolean>('appointments-loading', () => false);
    const lastFetchedDate = useState<string | null>('last-fetched-date', () => null);

    const fetchAppointments = async (start: string, end: string, force: boolean = false) => {
        if (!profile.value?.organization_id) return;

        if (!force && lastFetchedDate.value === start) return;

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
            lastFetchedDate.value = start;
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            loading.value = false;
        }
    }

    const createAppointment = async (payload: TablesInsert<'appointments'>) => {
        const { data, error } = await supabase
            .from('appointments')
            .insert(payload)
            .select()
            .single()

        if (error) throw error;
        lastFetchedDate.value = null;
        appointments.value.push(data);
        return data
    }

    return { appointments, loading, fetchAppointments, createAppointment }
}