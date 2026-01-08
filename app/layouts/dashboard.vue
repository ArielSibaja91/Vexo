<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[{
    label: 'Inicio',
    icon: 'i-lucide-chart-no-axes-combined',
    to: '/app/dashboard',
}, {
    label: 'Agenda',
    icon: 'i-lucide-calendar-days',
    to: '/app/agenda',
}, {
    label: 'Servicios',
    icon: 'i-lucide-hand-coins',
    to: '/app/services',
}, {
    label: 'Ajustes',
    icon: 'i-lucide-settings',
    to: '/app/configuration'
}],]

const supabase = useSupabaseClient();

async function logout() {
    await supabase.auth.signOut();
    navigateTo('/login');
};
</script>

<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
            <template #header>
                
                <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />

                <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" />
            </template>

            <template #footer>
                <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" class="w-full" loading-auto @click="logout">
                    Cerrar Sesión
                </UButton>
            </template>
        </UDashboardSidebar>
        <UContainer class="flex-1 overflow-y-auto py-5">
            <slot />
        </UContainer>
    </UDashboardGroup>
</template>