import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.helper';

export const useBusinessHours = () => {
    const supabase = useSupabaseClient();
    const { profile } = useProfile();
    const hours = useState<Tables<'business_hours'>[]>('business-hours', () => []);
    const loading = useState<boolean>('hours-loading', () => false);

    const fetchHours = async (force: boolean = false) => {
        if (!profile.value?.organization_id) return;

        if (hours.value.length > 0 && !force) {
            return;
        }

        loading.value = true;
        try {
            const { data, error } = await supabase
                .from('business_hours')
                .select('*')
                .eq('organization_id', profile.value.organization_id)
                .order('day_of_week', { ascending: true })

            if (error) throw error
            // If the table is empty, it auto generates the 7 days
            if (!data || data.length === 0) {
                await seedDefaultHours();
            } else {
                hours.value = data;
            }
        } catch (error) {
            console.error('Error while getting hours:', error);
        } finally {
            loading.value = false;
        }
    }

    const seedDefaultHours = async () => {
        const orgId = profile.value?.organization_id;
        if (!orgId) return;

        const defaultHours: TablesInsert<'business_hours'>[] = Array.from({ length: 7 }, (_, i) => ({
            organization_id: orgId,
            day_of_week: i,
            is_enabled: i !== 0,
            open_time: '08:00:00',
            close_time: '17:00:00'
        }));

        try {
            const { data, error } = await supabase
                .from('business_hours')
                .insert(defaultHours)
                .select()
                .order('day_of_week', { ascending: true })

            if (error) throw error;
            hours.value = data || [];
        } catch (error) {
            console.error('Error creating default hours:', error);
        }
    }

    const updateHourRow = async (id: string, payload: TablesUpdate<'business_hours'>) => {
        try {
            const { data, error } = await supabase
                .from('business_hours')
                .update(payload)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error;
            const index = hours.value.findIndex(h => h.id === id);
            if (index !== -1) hours.value[index] = data;
        } catch (error) {
            console.error('Error updating hours:', error);
        }
    }

    return { hours, loading, fetchHours, updateHourRow }
}