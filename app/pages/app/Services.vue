<script setup lang="ts">
import type { Tables } from '~/types/database.helper';

definePageMeta({ layout: 'dashboard' });

const { services, loading, fetchServices, deleteService } = useServices();
const isOpen = ref<boolean>(false);
const selectedService = ref<Tables<'services'> | undefined>(undefined);

const handleEdit = (id: string) => {
    // Searches the service in the local services array
    selectedService.value = services.value.find(s => s.id === id);
    isOpen.value = true;
};

const handleNew = () => {
    selectedService.value = undefined;
    isOpen.value = true;
};

onMounted(() => fetchServices());
</script>

<template>
    <UDashboardPanel class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-white">Servicios</h1>
                <p class="text-slate-400 text-sm">Gestione los servicios que ofrece su local.</p>
            </div>
            <UButton icon="i-lucide-plus" label="Nuevo Servicio" color="primary" @click="handleNew" />
            <UModal v-model:open="isOpen">

                <template #content>
                    <UCard class="bg-slate-900 border-slate-800">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-semibold text-white">
                                    {{ selectedService ? 'Editar Servicio' : 'Añadir Servicio' }}
                                </h3>
                                <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isOpen = false" />
                            </div>
                        </template>

                        <ServicesServiceForm 
                        :key="selectedService?.id || 'new'" :initial-data="selectedService"
                            @success="isOpen = false" @cancel="isOpen = false" />
                    </UCard>
                </template>
            </UModal>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loading" class="flex justify-center py-10">
                <UIcon name="i-lucide-loader" class="animate-spin size-8 text-primary" />
            </div>

            <template v-else>
                <UCard 
                v-if="services.length === 0"
                    class="bg-slate-900/50 border-slate-800 border-dashed border-2 py-12">
                    <div class="flex flex-col items-center text-center space-y-4">
                        <div class="p-4 bg-slate-800 rounded-full aspect-square">
                            <UIcon name="i-lucide-briefcase-business" class="size-8 text-slate-400" />
                        </div>
                        <div class="max-w-xs">
                            <h3 class="text-white font-medium">No hay servicios creados</h3>
                            <p class="text-slate-500 text-sm mt-1">Defina sus servicios para empezar a agendar citas.
                            </p>
                        </div>
                    </div>
                </UCard>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ServicesServiceCard 
                    v-for="service in services" 
                    :key="service.id" 
                    :service="service"
                    @delete="deleteService" 
                    @edit="handleEdit" 
                    />
                </div>
            </template>
        </div>
    </UDashboardPanel>
</template>