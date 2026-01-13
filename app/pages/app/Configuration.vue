<script setup lang="ts">
import type { Tables } from '~/types/database.helper';

definePageMeta({ layout: 'dashboard' });

const { hours, loading, fetchHours, updateHourRow } = useBusinessHours();
const { profile } = useProfile();

const daysName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

onMounted(async () => {
    // If the profile exists, it loads the hours immediately
    if (profile.value?.organization_id) await fetchHours();
    // regardless, watches the profile if it takes a while to load
    watch(() => profile.value?.organization_id, async (newOrgId) => {
        if (newOrgId && hours.value.length === 0) await fetchHours();
    }, { immediate: true }) // immediate helps if it loads instanly
});

async function toggleDay(row: Tables<'business_hours'>) {
    await updateHourRow(row.id, { is_enabled: !row.is_enabled })
};

async function saveTime(row: Tables<'business_hours'>, field: string, value: string) {
    await updateHourRow(row.id, { [field]: value })
};
</script>

<template>
    <UDashboardPanel class="space-y-6 py-5">
        <header class="mb-8">
            <h1 class="text-2xl font-bold text-white">Configuración</h1>
            <p class="text-slate-400 text-sm">Gestiona los horarios y detalles de tu negocio.</p>
        </header>

        <UCard class="bg-slate-900 border-slate-800">
            <div class="space-y-6">
                <h2 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">Horarios de Atención</h2>

                <div v-if="loading" class="space-y-4">
                    <USkeleton v-for="i in 7" :key="i" class="h-12 w-full" />
                </div>

                <div v-else class="divide-y divide-slate-800">
                    <div v-for="day in hours" :key="day.id" class="py-4 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-4 w-32">
                            <USwitch :model-value="day.is_enabled === null ? undefined : day.is_enabled" @update:model-value="toggleDay(day)" />
                            <span class="font-medium" :class="day.is_enabled ? 'text-white' : 'text-slate-500'">
                                {{ daysName[day.day_of_week] }}
                            </span>
                        </div>

                        <div v-if="day.is_enabled" class="flex items-center gap-2 flex-1 justify-end">
                            <UInput 
                            type="time" :model-value="day.open_time"
                            variant="outline" size="sm"
                            @change="(e: Event) => saveTime(day, 'open_time', (e.target as HTMLInputElement).value)"
                            />
                            <span class="text-slate-500 text-sm text-center px-2">a</span>
                            <UInput 
                            type="time" :model-value="day.close_time" variant="outline"
                                @change="(e: Event) => saveTime(day, 'close_time', (e.target as HTMLInputElement).value)" />
                        </div>

                        <div v-else class="flex-1 text-right italic text-slate-600 text-sm">
                            Cerrado
                        </div>
                    </div>
                </div>
            </div>
        </UCard>
    </UDashboardPanel>
</template>