<script setup lang="ts">
import { format } from 'date-fns';
import type { AppointmentWithDetails } from '~/types/appointments';

const props = defineProps<{
    apt: AppointmentWithDetails
}>();

const emit = defineEmits(['edit', 'delete']);

const actions = [
    [{
        label: 'Editar cita',
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
];
</script>

<template>
    <div 
    :class="[
        'bg-slate-900 border border-slate-800 border-l-4 rounded-r-xl p-4 flex items-center gap-4 shadow-sm transition-all',
        apt.status === 'confirmed' ? 'border-l-green-500' : 'border-l-primary-500'
    ]">
        <div class="text-center min-w-25">
            <span class="text-white font-bold block text-sm">
                {{
                    apt.start_time ? format(new Date(apt.start_time), 'HH:mm') : '--:--'
                }} - {{
                    apt.end_time ? format(new Date(apt.end_time), 'HH:mm') : '--:--'
                }}
            </span>
            <span class="text-slate-500 text-sm uppercase font-bold">
                {{ apt.services?.duration_minutes }} min
            </span>
        </div>

        <div class="border-x border-slate-800 px-5 flex-1 min-w-0">
            <h4 class="text-white font-semibold truncate">{{ apt.clients?.full_name }}</h4>
            <div class="flex items-center gap-2 mt-1">
                <UBadge size="md" variant="subtle" color="primary">
                    {{ apt.services?.name }}
                </UBadge>
                <span class="text-slate-500 text-sm">${{ apt.services?.price }}</span>
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