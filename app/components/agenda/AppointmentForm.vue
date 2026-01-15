<script setup lang="ts">
import { addMinutes, parseISO, format } from 'date-fns'
import type { Tables, TablesInsert } from '~/types/database.helper'

const props = defineProps<{
    initialDate?: Date,
    initialData?: Tables<'appointments'>
}>();

const emit = defineEmits(['close', 'saved'])
const { createAppointment, updateAppointment } = useAppointments()
const { clients, fetchClients } = useClients()
const { services, fetchServices } = useServices()
const { profile } = useProfile()

const isPending = ref(false);
const isEditing = computed(() => !!props.initialData);

const state = reactive({
    client_id: props.initialData?.client_id || undefined,
    service_id: props.initialData?.service_id || undefined,
    start_time: props.initialData 
        ? format(new Date(props.initialData.start_time), "yyyy-MM-dd'T'HH:mm")
        : format(props.initialDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
    notes: props.initialData?.notes || ''
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
            status: props.initialData?.status || 'pending'
        }

        if (isEditing.value && props.initialData) {
            await updateAppointment(props.initialData.id, payload)
        } else {
            await createAppointment(payload)
        }
        
        emit('saved')
    } catch (error) {
        console.error('Error processing appointment:', error)
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
                :label="isEditing ? 'Guardar Cambios' : 'Agendar Cita'" 
                color="primary" 
                :loading="isPending" 
            />
        </div>
    </UForm>
</template>