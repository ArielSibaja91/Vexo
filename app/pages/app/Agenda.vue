<script setup lang="ts">
import { format, startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AppointmentWithDetails } from '~/types/appointments';

definePageMeta({ layout: 'dashboard' });

const { appointments, loading, fetchAppointments, deleteAppointment } = useAppointments()
const { fetchHours } = useBusinessHours()

const appointmentsExtended = computed(() => appointments.value as unknown as AppointmentWithDetails[]);

const selectedDate = ref(new Date());
const isFormOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedAppointment = ref<AppointmentWithDetails | null>(null)

const loadData = async () => {
    const start = startOfDay(selectedDate.value).toISOString();
    const end = endOfDay(selectedDate.value).toISOString();

    await Promise.all([
        fetchHours(),
        fetchAppointments(start, end)
    ])
}
watch(selectedDate, loadData);
onMounted(loadData);

const openCreate = () => { selectedAppointment.value = null; isFormOpen.value = true; }
const openEdit = (apt: AppointmentWithDetails | null) => { selectedAppointment.value = apt; isFormOpen.value = true; }
const openDelete = (apt: AppointmentWithDetails | null) => { selectedAppointment.value = apt; isDeleteOpen.value = true; }

const dateLabel = computed(() => format(selectedDate.value, "EEEE, d 'de' MMMM", { locale: es }));
</script>

<template>
    <UDashboardPanel class="space-y-6 py-5">
        <header class="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 pb-4">
            <div class="flex items-center justify-between">
                <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-left" @click="selectedDate = subDays(selectedDate, 1)" />
                <div class="text-center">
                    <h2 class="text-white font-bold capitalize">{{ dateLabel }}</h2>
                    <p class="text-xs text-primary-400 font-medium">
                        {{ appointments.length }} citas programadas
                    </p>
                </div>
                <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-right" @click="selectedDate = addDays(selectedDate, 1)" />
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-if="loading" class="space-y-4">
                <USkeleton v-for="i in 4" :key="i" class="h-20 w-full" />
            </div>

            <template v-else>
                <div 
                v-if="appointments.length === 0"
                    class="flex flex-col items-center justify-center h-64 text-center">
                    <UIcon name="i-lucide-calendar-x" class="w-12 h-12 text-slate-600 mb-2" />
                    <p class="text-slate-400">No hay citas para este día</p>
                    <UButton label="Agendar Cita" variant="link" color="primary" class="mt-2" @click="openCreate" />
                </div>

                <div v-else class="space-y-3">
                    <AgendaAppointmentCard 
                    v-for="apt in appointmentsExtended" :key="apt.id" :apt="apt" @edit="openEdit"
                        @delete="openDelete" @refresh="loadData" />
                </div>
            </template>
        </main>

        <div class="fixed bottom-6 right-6">
            <UButton 
            icon="i-lucide-plus" size="xl" color="primary"
                class="rounded-full shadow-2xl h-14 w-14 flex items-center justify-center" @click="openCreate" />
        </div> 

        <UModal v-model:open="isFormOpen">
            <template #content>
                <UCard class="bg-slate-900 border-slate-800">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-white font-bold">{{ selectedAppointment ? 'Editar Cita' : 'Nueva Cita' }}
                            </h3>
                            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isFormOpen = false" />
                        </div>
                    </template>
                    <AgendaAppointmentForm 
                    :key="selectedAppointment?.id || 'new'" :initial-date="selectedDate"
                        :initial-data="selectedAppointment || undefined"
                        @saved="async () => { await loadData(); isFormOpen = false; }" @close="isFormOpen = false" />
                </UCard>
            </template>
        </UModal>

        <SharedConfirmModal 
        v-model:open="isDeleteOpen" title="¿Eliminar cita?"
            :description="`¿Está seguro de eliminar la cita de ${selectedAppointment?.clients?.full_name}?`"
            @confirm="async () => { await deleteAppointment(selectedAppointment!.id); isDeleteOpen = false; }" />
    </UDashboardPanel>
</template>