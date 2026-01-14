<script setup lang="ts">
import { format, startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Tables } from '~/types/database.helper';

definePageMeta({ layout: 'dashboard' });

interface AppointmentWithDetails extends Tables<'appointments'> {
    clients: Tables<'clients'> | null
    services: Tables<'services'> | null
}

const { appointments, loading, fetchAppointments } = useAppointments()
const { fetchHours } = useBusinessHours()

const appointmentsExtended = computed(() => appointments.value as unknown as AppointmentWithDetails[]);

const selectedDate = ref(new Date());
const isFormOpen = ref(false);

const loadData = async () => {
    const start = startOfDay(selectedDate.value).toISOString()
    const end = endOfDay(selectedDate.value).toISOString()

    await Promise.all([
        fetchHours(),
        fetchAppointments(start, end)
    ])
}
watch(selectedDate, loadData)
onMounted(loadData)

const dateLabel = computed(() => {
    return format(selectedDate.value, "EEEE, d 'de' MMMM", { locale: es })
})

const nextDay = () => { selectedDate.value = addDays(selectedDate.value, 1) }
const prevDay = () => { selectedDate.value = subDays(selectedDate.value, 1) }
</script>

<template>
    <UDashboardPanel class="space-y-6 py-5">
        <header class="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 pb-4">
            <div class="flex items-center justify-between">
                <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-left" @click="prevDay" />

                <div class="text-center">
                    <h2 class="text-white font-bold capitalize">{{ dateLabel }}</h2>
                    <p class="text-xs text-primary-400 font-medium">
                        {{ appointments.length }} citas programadas
                    </p>
                </div>

                <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-right" @click="nextDay" />
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-if="loading" class="space-y-4">
                <USkeleton v-for="i in 5" :key="i" class="h-20 w-full" />
            </div>

            <div 
            v-else-if="appointments.length === 0"
                class="flex flex-col items-center justify-center h-64 text-center">
                <UIcon name="i-lucide-calendar-x" class="w-12 h-12 text-slate-600 mb-2" />
                <p class="text-slate-400">No hay citas para este día</p>
                <UButton label="Agendar Cita" variant="link" color="primary" class="mt-2" @click="isFormOpen = true" />
            </div>

            <div v-else class="space-y-3">
                <div 
                v-for="apt in appointmentsExtended" :key="apt.id" :class="[
                    'bg-slate-900 border-l-4 rounded-r-xl p-4 flex items-center gap-4 shadow-sm border border-slate-800',
                    apt.status === 'confirmed' ? 'border-green-500' : 'border-primary-500'
                ]">
                    <div class="text-center min-w-15">
                        <span class="text-white font-bold block text-lg">
                            {{ format(new Date(apt.start_time), 'HH:mm') }}
                        </span>
                        <span class="text-slate-500 text-[10px] uppercase font-bold">
                            {{ (apt.services as any)?.duration_minutes }} min
                        </span>
                    </div>

                    <div class="flex-1 border-l border-slate-800 pl-4">
                        <h4 class="text-white font-semibold truncate">{{ (apt.clients)?.full_name }}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <UBadge size="xs" variant="subtle" color="primary">
                                {{ (apt.services)?.name }}
                            </UBadge>
                            <span class="text-slate-500 text-xs">${{ (apt.services)?.price }}</span>
                        </div>
                    </div>

                    <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
                </div>
            </div>
        </main>

        <div class="fixed bottom-6 right-6">
            <UButton 
            icon="i-lucide-plus" size="xl" color="primary"
                class="rounded-full shadow-2xl h-14 w-14 flex items-center justify-center" @click="isFormOpen = true" />
        </div>

        <UModal v-model:open="isFormOpen">
            <template #content>
                <UCard class="bg-slate-900 border-slate-800">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold text-white">
                                Agendar Nueva Cita
                            </h3>
                            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isFormOpen = false" />
                        </div>
                    </template>

                    <AgendaAppointmentForm 
                    :initial-date="selectedDate"
                        @saved="async () => { await loadData(); isFormOpen = false; }" @close="isFormOpen = false" />
                </UCard>
            </template>
        </UModal>
    </UDashboardPanel>
</template>