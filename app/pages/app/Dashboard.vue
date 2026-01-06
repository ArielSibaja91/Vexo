<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
});
const supabase = useSupabaseClient();

async function logout() {
    await supabase.auth.signOut()
    navigateTo('/login');
};
</script>

<template>
    <div>
        <h1>Hello dashboard</h1>
        <UButton color="error" variant="ghost" @click="logout">
            Cerrar Sesión
        </UButton>
    </div>
</template>