<script setup lang="ts">
import type { Tables } from '~/types/database.helper';

defineProps<{
    service: Tables<'services'>
}>();

defineEmits(['delete', 'edit']);
</script>

<template>
    <UCard class="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
        <div class="flex flex-col gap-2">
            <div class="flex justify-between items-start">
                <h4 class="font-bold text-white capitalize">{{ service.name }}</h4>
                <UBadge color="primary" variant="subtle" size="lg">₡{{ service.price }}</UBadge>
            </div>
            <div class="flex items-center gap-2 text-slate-400 text-sm">
                <UIcon name="i-lucide-clock" />
                {{ service.duration_minutes }} min
            </div>
            <div class="flex gap-1">
                <UButton 
                icon="i-lucide-trash" label="Borrar" color="error" variant="ghost" size="sm"
                    @click="$emit('delete', service.id)" />
                <UButton 
                icon="i-lucide-pen" label="Editar" color="primary" variant="ghost" size="sm"
                    @click="$emit('edit', service.id)" />
            </div>
        </div>
    </UCard>
</template>