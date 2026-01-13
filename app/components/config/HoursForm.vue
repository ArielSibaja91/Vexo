<script setup lang="ts">
import type { Tables } from '~/types/database.helper'

const { hours, loading, updateHourRow } = useBusinessHours();
const daysName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

async function toggleDay(row: Tables<'business_hours'>) {
    await updateHourRow(row.id, { is_enabled: !row.is_enabled });
}

async function saveTime(row: Tables<'business_hours'>, field: string, value: string) {
    await updateHourRow(row.id, { [field]: value });
}
</script>

<template>
    <UCard class="bg-slate-900 border-slate-800 mt-4">
        <template #header>
            <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="text-primary-400 w-5 h-5" />
                <h3 class="text-white font-semibold text-lg">Horarios de cierre y apertura</h3>
            </div>
            <p class="text-slate-400 text-xs mt-1">Estos horarios serán visibles para los clientes al agendar</p>
        </template>

        <div v-if="loading" class="space-y-4 p-4">
            <USkeleton v-for="i in 7" :key="i" class="h-12 w-full" />
        </div>

        <div v-else class="divide-y divide-slate-800">
            <div 
            v-for="day in (hours as Tables<'business_hours'>[])" :key="day.id"
                class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div class="flex items-center gap-4 min-w-35">
                    <USwitch :model-value="day.is_enabled ?? false" @update:model-value="toggleDay(day)" />
                    <span class="font-medium" :class="day.is_enabled ? 'text-white' : 'text-slate-500'">
                        {{ daysName[day.day_of_week] }}
                    </span>
                </div>

                <div v-if="day.is_enabled" class="flex items-center gap-2 justify-end bg-slate-800/30 p-2 rounded-lg">
                    <UInput 
                    type="time" :model-value="day.open_time" variant="outline" size="sm" class="w-32"
                        @change="(e: Event) => saveTime(day, 'open_time', (e.target as HTMLInputElement).value)" />
                    <span class="text-slate-500 text-xs px-1 uppercase font-bold">A</span>
                    <UInput 
                    type="time" :model-value="day.close_time" variant="outline" size="sm" class="w-32"
                        @change="(e: Event) => saveTime(day, 'close_time', (e.target as HTMLInputElement).value)" />
                </div>

                <div v-else class="flex-1 text-right italic text-slate-600 text-sm pr-4">
                    Cerrado
                </div>
            </div>
        </div>
    </UCard>
</template>