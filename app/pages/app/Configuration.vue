<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });

const { profile, fetchProfile } = useProfile();
const { fetchHours} = useBusinessHours();
const { fetchOrganization } = useOrganization();

const items = [
    { label: 'Negocio', icon: 'i-lucide-store', slot: 'business' },
    { label: 'Horarios', icon: 'i-lucide-clock', slot: 'hours' }
];

onMounted(async () => {
    if (!profile.value) await fetchProfile();

    await Promise.all([
        fetchHours(),
        fetchOrganization()
    ]);
});
</script>

<template>
    <UDashboardPanel class="space-y-6 py-5">
        <header class="mb-8">
            <h1 class="text-2xl font-bold text-white">Configuración</h1>
            <p class="text-slate-400 text-sm">Administre los datos y horarios de su negocio</p>
        </header>

        <UTabs :items="items" class="w-full">
            <template #business>
                <ConfigBusinessForm />
            </template>

            <template #hours>
                <ConfigHoursForm />
            </template>
        </UTabs>
    </UDashboardPanel>
</template>