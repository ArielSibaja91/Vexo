<script setup lang="ts">
defineProps<{
    open: boolean
    title: string
    description: string
    loading?: boolean
    confirmLabel?: string
    confirmColor?: 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | undefined
}>();

const emit = defineEmits(['update:open', 'confirm'])
</script>

<template>
    <UModal :open="open" @update:open="(val) => emit('update:open', val)">
        <template #content>
            <UCard class="bg-slate-900 border-slate-800">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="p-2.5 bg-slate-800 rounded-lg flex justify-center items-center">
                            <UIcon name="i-lucide-alert-triangle" class="size-5 text-error" />
                        </div>
                        <h3 class="text-base font-semibold text-white">{{ title }}</h3>
                    </div>
                </template>

                <div class="py-2">
                    <p class="text-slate-400">{{ description }}</p>
                </div>

                <template #footer>
                    <div class="flex justify-end gap-3">
                        <UButton 
                        label="Cancelar" color="neutral" variant="ghost"
                            @click="emit('update:open', false)" />
                        <UButton 
                        :label="confirmLabel || 'Confirmar'" :color="confirmColor || 'error'"
                            :loading="loading" @click="emit('confirm')" />
                    </div>
                </template>
            </UCard>
        </template>
    </UModal>
</template>