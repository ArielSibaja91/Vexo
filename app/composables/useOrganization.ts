import type { Tables, TablesUpdate } from '~/types/database.helper'

export const useOrganization = () => {
    const supabase = useSupabaseClient()
    const { profile } = useProfile()
    const organization = useState<Tables<'organizations'> | null>('current-org', () => null)
    const loading = useState<boolean>('org-loading', () => false)

    const fetchOrganization = async (force: boolean = false) => {
        if (organization.value && !force) return;

        if (!profile.value?.organization_id) return;

        loading.value = true;
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', profile.value.organization_id)
                .single()

            if (error) throw error;
            organization.value = data;
        } catch (error) {
            console.error('Error loading organization:', error);
        } finally {
            loading.value = false;
        }
    }

    const updateOrganization = async (payload: TablesUpdate<'organizations'>) => {
        if (!organization.value?.id) return
        try {
            const { data, error } = await supabase
                .from('organizations')
                .update(payload)
                .eq('id', organization.value.id)
                .select()
                .single()

            if (error) throw error;
            organization.value = data;
        } catch (error) {
            console.error('Error updating:', error);
        }
    }

    return { organization, loading, fetchOrganization, updateOrganization }
}