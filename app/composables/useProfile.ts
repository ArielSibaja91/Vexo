import type { Tables } from '~/types/database.helper';

export const useProfile = () => {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    
    const profile = useState<Tables<'profiles'> | null>('user-profile', () => null);
    const loading = useState<boolean>('profile-loading', () => false);

const fetchProfile = async () => {
    const userId = user.value?.sub 

    if (!userId) {
        console.warn('User ID not found')
        return
    };
    
    if (profile.value) return;

    loading.value = true;
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId) 
            .single()

        if (error) throw error
        profile.value = data
        console.log('Profile loaded successfully:', data);
    } catch (error) {
        console.error('Error loading profile:', error);
    } finally {
        loading.value = false;
    }
}

    return { profile, loading, fetchProfile }
}