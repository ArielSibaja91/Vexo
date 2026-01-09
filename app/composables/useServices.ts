import type { Tables, TablesInsert, TableId, TablesUpdate } from "~/types/database.helper";

const services = ref<Tables<'services'>[]>([]);
const loading = ref<boolean>(false);

export const useServices = () => {
    const client = useSupabaseClient();

    const fetchServices = async (force: boolean = false) => {
        if (services.value.length > 0 && !force) {
            return; 
        }   
        loading.value = true
        try {
            const { data, error } = await client
                .from('services')
                .select('*')
                .order('name')
            if (error) throw error
            services.value = data || [];
        } finally {
            loading.value = false;
        }
    }

    const createService = async (payload: Omit<TablesInsert<'services'>, 'organization_id' | 'id' | 'created_at'>) => {
        const { data: { session } } = await client.auth.getSession()
        const userId = session?.user?.id

        if (!userId) {
            throw new Error('Sesión invalida.')
        }

        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('organization_id')
            .eq('id', userId)
            .single()

        if (profileError || !profile?.organization_id) {
            console.error('Error de perfil:', profileError)
            throw new Error('No se encontró la organización.')
        }

        const { data, error } = await client
            .from('services')
            .insert({
                ...payload,
                organization_id: profile.organization_id
            })
            .select()
            .single()

        if (error) throw error

        await fetchServices();
        return data
    }

    const deleteService = async (id: TableId<'services'>) => {
        loading.value = true
        try {
            const { error } = await client
                .from('services')
                .delete()
                .eq('id', id)

            if (error) throw error
            // Optimistic update
            services.value = services.value.filter(s => s.id !== id)
        } catch (err) {
            console.error('Error deleting: ', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateService = async (id: TableId<'services'>, payload: TablesUpdate<'services'>) => {
        loading.value = true
        try {
            const { data, error } = await client
                .from('services')
                .update(payload)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            const index = services.value.findIndex(s => s.id === id)
            if (index !== -1) {
                services.value[index] = data
            }

            return data
        } catch (error) {
            console.error('Error actualizando servicio:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        services,
        loading,
        fetchServices,
        createService,
        deleteService,
        updateService
    }
}