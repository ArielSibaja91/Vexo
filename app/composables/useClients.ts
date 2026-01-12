import type { Tables, TablesInsert, TablesUpdate, TableId } from '~/types/database.helper'

export const useClients = () => {
    const client = useSupabaseClient();

    const clients = useState<Tables<'clients'>[]>('clients-list', () => [])
    const loading = useState<boolean>('clients-loading', () => false)

    const fetchClients = async (force: boolean = false) => {
        if (clients.value.length > 0 && !force) {
            return;
        }
        
        loading.value = true
        try {
            const { data, error } = await client
                .from('clients')
                .select('*')
                .order('full_name')
            
            if (error) throw error
            clients.value = data || []
        } catch (error) {
            console.error('Error fetching clients:', error)
        } finally {
            loading.value = false
        }
    }

    const createClient = async (payload: TablesInsert<'clients'>) => {
        const { data, error } = await client
            .from('clients')
            .insert(payload)
            .select()
            .single()
        
        if (error) throw error
        clients.value.push(data)
        return data
    }

    const updateClient = async (id: TableId<'clients'>, payload: TablesUpdate<'clients'>) => {
        const { data, error } = await client
            .from('clients')
            .update(payload)
            .eq('id', id)
            .select()
            .single()
        
        if (error) throw error
        const index = clients.value.findIndex(c => c.id === id)
        if (index !== -1) clients.value[index] = data
        return data
    }

    const deleteClient = async (id: TableId<'clients'>) => {
        const { error } = await client.from('clients').delete().eq('id', id)
        if (error) throw error
        clients.value = clients.value.filter(c => c.id !== id)
    }

    return {
        clients,
        loading,
        fetchClients,
        createClient,
        updateClient,
        deleteClient
    }
}