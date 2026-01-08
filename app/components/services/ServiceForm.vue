<script setup lang="ts">
import type { Tables } from '~/types/database.helper';

const props = defineProps<{
    initialData?: Tables<'services'> // If it exists, it is editing
}>();

const emit = defineEmits(['success', 'cancel'])
const { createService, updateService } = useServices()

const state = reactive({
    name: props.initialData?.name || '',
    price: props.initialData?.price || 0,
    duration_minutes: props.initialData?.duration_minutes || 30
});

const isPending = ref<boolean>(false);
const isEditing = computed(() => !!props.initialData);

async function onSubmit() {
    isPending.value = true
    try {
        const payload = {
            name: state.name,
            price: Number(state.price),
            duration_minutes: Number(state.duration_minutes)
        }

        if (isEditing.value && props.initialData) {
            await updateService(props.initialData.id, payload)
        } else {
            await createService(payload)
        }
        emit('success');
    } catch (error) {
        console.error('Error creating service:', error)
    } finally {
        isPending.value = false
    }
}
</script>

<template>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Nombre del servicio" name="name">
            <UInput v-model="state.name" placeholder="Ej. Corte de Cabello" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
            <UFormField label="Precio (₡)" name="price">
                <UInput v-model="state.price" type="number" />
            </UFormField>

            <UFormField label="Duración (minutos)" name="duration_minutes">
                <USelect v-model="state.duration_minutes" :items="[15, 30, 45, 60, 90, 120]" />
            </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <UButton label="Cancelar" color="error" variant="ghost" @click="$emit('cancel')" />
            <UButton type="submit" :label="isEditing ? 'Guardar Cambios' : 'Crear Servicio'" color="primary" :loading="isPending" />
        </div>
    </UForm>
</template>