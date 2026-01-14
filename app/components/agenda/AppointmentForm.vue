<script setup lang="ts">
import { addMinutes, parseISO, format } from 'date-fns'
import type { TablesInsert } from '~/types/database.helper'

const props = defineProps<{
    initialDate?: Date
}>()

const emit = defineEmits(['close', 'saved'])
const { createAppointment } = useAppointments()
const { clients, fetchClients } = useClients()
const { services, fetchServices } = useServices()
const { profile } = useProfile()

const isPending = ref(false)

const state = reactive({
    client_id: undefined,
    service_id: undefined,
    start_time: format(props.initialDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
    notes: ''
})

onMounted(() => {
    fetchClients();
    fetchServices();
})

async function onSubmit() {
    const orgId = profile.value?.organization_id
    if (!orgId) return;

    isPending.value = true;
    try {
        const selectedService = services.value.find(s => s.id === state.service_id)
        const duration = selectedService?.duration_minutes || 30

        const start = parseISO(state.start_time)
        const end = addMinutes(start, duration)

        const payload: TablesInsert<'appointments'> = {
            organization_id: orgId,
            client_id: state.client_id,
            service_id: state.service_id,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            notes: state.notes,
            status: 'pending'
        }

        await createAppointment(payload)
        emit('saved')
    } catch (error) {
        console.error('Error:', error)
    } finally {
        isPending.value = false
    }
}
</script>

<template>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Cliente" name="client_id" size="lg">
            <USelectMenu 
                v-model="state.client_id"
                class="w-full" 
                :items="clients" 
                label-key="full_name"
                value-key="id"
                searchable 
                placeholder="Buscar cliente..."
            />
        </UFormField>

        <UFormField label="Servicio" name="service_id" size="lg">
            <USelectMenu 
                v-model="state.service_id" 
                class="w-full"
                :items="services" 
                label-key="name"
                value-key="id"
                placeholder="Selecciona un servicio"
            />
        </UFormField>

        <UFormField label="Fecha y Hora" name="start_time" size="lg">
            <UInput v-model="state.start_time" class="w-full" type="datetime-local" />
        </UFormField>

        <UFormField label="Notas opcionales" name="notes" size="lg">
            <UTextarea v-model="state.notes" placeholder="Detalles adicionales..." class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <UButton label="Cancelar" color="error" variant="ghost" @click="$emit('close')" />
            <UButton 
                type="submit" 
                label="Guardar Cita" 
                color="primary" 
                :loading="isPending" 
            />
        </div>
    </UForm>
</template>