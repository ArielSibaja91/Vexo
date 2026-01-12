<script setup lang="ts">
import type { Tables } from '~/types/database.helper';

const props = defineProps<{
    initialData?: Tables<'clients'>
}>();

const emit = defineEmits(['success', 'cancel'])
const { createClient, updateClient } = useClients();
const { profile } = useProfile();

const state = reactive({
    full_name: props.initialData?.full_name || '',
    phone: props.initialData?.phone || '',
    email: props.initialData?.email || '',
});

const isPending = ref(false);
const isEditing = computed(() => !!props.initialData);

async function onSubmit() {
const orgId = profile.value?.organization_id
    
    if (!orgId) {
        console.error('Vinculated organitzation not found')
        return
    };

    isPending.value = true;
    try {
        const payload = { 
            full_name: state.full_name,
            phone: state.phone,
            email: state.email,
            organization_id: orgId
        }

        if (isEditing.value && props.initialData) {
            await updateClient(props.initialData.id, payload)
        } else {
            await createClient(payload)
        }
        emit('success');
    } catch (error) {
        console.error('Error:', error)
    } finally {
        isPending.value = false;
    }
}
</script>

<template>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-4">
            <UFormField label="Nombre Completo" name="full_name" size="lg">
                <UInput v-model="state.full_name" placeholder="Juan Pérez" />
            </UFormField>
            <UFormField label="Teléfono" name="phone" size="lg">
                <UInput v-model="state.phone" placeholder="8888-8888" />
            </UFormField>
            <UFormField label="Email" name="email" size="lg">
                <UInput v-model="state.email" type="email" placeholder="juan@correo.com" />
            </UFormField>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <UButton label="Cancelar" color="error" variant="ghost" @click="$emit('cancel')" />
            <UButton 
            type="submit" :label="isEditing ? 'Guardar Cambios' : 'Crear Cliente'" color="primary"
                :loading="isPending" />
        </div>
    </UForm>
</template>