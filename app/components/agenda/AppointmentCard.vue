<script setup lang="ts">
import { format } from 'date-fns';
import type { AppointmentWithDetails } from '~/types/appointments';

const props = defineProps<{
    apt: AppointmentWithDetails
}>();

const emit = defineEmits(['edit', 'delete', 'refresh']);
const { updateAppointment } = useAppointments();
const toast = useToast();

const setStatus = async (status: string) => {
    try {
        await updateAppointment(props.apt.id, { status });
        toast.add({
            title: 'Estado actualizado',
            description: `Cita marcada como ${status}`,
            color: 'success'
        });
        emit('refresh');
    } catch (error) {
        toast.add({ title: 'Error', description: 'No se pudo actualizar', color: 'error' });
        console.error(error)
    }
};

const actions = computed(() => [
    [{
        label: 'Confirmar cita',
        icon: 'i-lucide-check-circle',
        slot: 'status',
        onSelect: () => setStatus('confirmed')
    },
    {
        label: 'Marcar como finalizada',
        icon: 'i-lucide-sparkles',
        onSelect: () => setStatus('completed')
    },
    {
        label: 'Cancelar cita',
        icon: 'i-lucide-x-circle',
        onSelect: () => setStatus('cancelled')
    }],
    [{
        label: 'Editar detalles',
        icon: 'i-lucide-pen',
        onSelect: () => emit('edit', props.apt)
    }],
    [{
        label: 'Eliminar cita',
        icon: 'i-lucide-trash',
        labelClass: 'text-error-500',
        iconClass: 'text-error-500',
        onSelect: () => emit('delete', props.apt)
    }]
]);

const statusStyles = {
    pending: 'border-l-slate-500',
    confirmed: 'border-l-primary-500',
    cancelled: 'border-l-error-500',
    completed: 'border-l-blue-500'
};

const statusConfig = {
    pending: { label: 'Pendiente', color: 'neutral', icon: 'i-lucide-clock' },
    confirmed: { label: 'Confirmada', color: 'success', icon: 'i-lucide-check' },
    cancelled: { label: 'Cancelada', color: 'error', icon: 'i-lucide-circle-x' },
    completed: { label: 'Finalizada', color: 'info', icon: 'i-lucide-sparkles' }
} as const;

const currentStatus = computed(() => {
    return statusConfig[props.apt.status as keyof typeof statusConfig] || statusConfig.pending;
});
</script>

<template>
    <div 
    :class="[
        'bg-slate-900 border border-slate-800 border-l-4 rounded-r-xl p-4 flex items-center gap-4 shadow-sm transition-all',
        statusStyles[apt.status as keyof typeof statusStyles] || 'border-l-primary-500'
    ]">
        <div class="flex flex-col items-center text-center min-w-25">
            <span class="text-white font-bold block text-sm">
                {{ apt.start_time ? format(new Date(apt.start_time), 'HH:mm') : '--:--' }} -
                {{ apt.end_time ? format(new Date(apt.end_time), 'HH:mm') : '--:--' }}
            </span>
            <span class="text-slate-500 text-sm uppercase font-bold">
                {{ apt.services?.duration_minutes }} min
            </span>

            <div class="mt-1">
                <UBadge 
                size="sm" variant="subtle" :color="currentStatus.color" :icon="currentStatus.icon"
                    class="capitalize">
                    {{ currentStatus.label }}
                </UBadge>
            </div>
        </div>

        <div class="border-x border-slate-800 px-5 flex-1 min-w-0">
            <h4 class="text-white font-semibold truncate">{{ apt.clients?.full_name }}</h4>
            <div class="flex items-center gap-2 mt-1">
                <UBadge size="md" variant="subtle" color="primary">
                    {{ apt.services?.name }}
                </UBadge>
                <span class="text-slate-500 text-sm">₡{{ apt.services?.price }}</span>
            </div>
        </div>

        <div v-if="apt.notes" class="hidden md:block flex-1">
            <p class="text-slate-400 text-sm italic line-clamp-2">
                "{{ apt.notes }}"
            </p>
        </div>

        <UDropdownMenu :items="actions" :popper="{ placement: 'bottom-end' }">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
        </UDropdownMenu>
    </div>
</template>