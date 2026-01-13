<script setup lang="ts">
const { organization, updateOrganization, loading } = useOrganization();
const toast = useToast();

const state = reactive({
    name: '',
    address: '',
    phone: ''
});

watchEffect(() => {
    if (organization.value) {
        state.name = organization.value.name || ''
        state.address = organization.value.address || ''
        state.phone = organization.value.phone || ''
    }
});

async function saveOrg() {
    try {
        await updateOrganization({
            name: state.name,
            address: state.address,
            phone: state.phone
        })
        toast.add({ title: 'Éxito', description: 'Datos guardados', color: 'success' })
    } catch (error) {
        toast.add({ title: 'Error', description: 'No se pudo guardar', color: 'error' })
        console.error(error);
    }
}
</script>

<template>
    <UCard class="bg-slate-900 border-slate-800 mt-4">
        <template #header>
            <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="text-primary-400 w-5 h-5" />
                <h3 class="text-white font-semibold text-lg">Perfil del Negocio</h3>
            </div>
            <p class="text-slate-400 text-xs mt-1">Esta información será visible para sus clientes al agendar</p>
        </template>

        <div class="space-y-8 divide-y divide-slate-800/50">

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                <div class="md:col-span-1">
                    <label class="text-sm font-medium text-slate-200">Nombre Comercial</label>
                    <p class="text-xs text-slate-500 mt-1">El nombre público de su negocio</p>
                </div>
                <div class="md:col-span-2">
                    <UInput 
                    v-model="state.name" placeholder="Ej. Barbería El Estilo" variant="outline" size="md"
                        color="neutral" block />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                <div class="md:col-span-1">
                    <label class="text-sm font-medium text-slate-200">Teléfono de contacto</label>
                    <p class="text-xs text-slate-500 mt-1">Número para consultas de clientes</p>
                </div>
                <div class="md:col-span-2">
                    <UInput 
                    v-model="state.phone" placeholder="+506 8888-8888" icon="i-lucide-phone" size="md"
                        color="neutral" block />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                <div class="md:col-span-1">
                    <label class="text-sm font-medium text-slate-200">Ubicación</label>
                    <p class="text-xs text-slate-500 mt-1">Dirección física donde brinda sus servicios</p>
                </div>
                <div class="md:col-span-2">
                    <UTextarea 
                    v-model="state.address" :rows="3" placeholder="Puntos de referencia, número de local..."
                        autoresize color="neutral" block />
                </div>
            </div>

        </div>

        <template #footer>
            <div class="flex justify-end">
                <UButton 
                label="Actualizar información" color="primary" icon="i-lucide-check-circle" :loading="loading"
                    class="px-6" @click="saveOrg" />
            </div>
        </template>
    </UCard>
</template>