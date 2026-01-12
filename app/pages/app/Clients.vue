<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Tables } from '~/types/database.helper'

definePageMeta({ layout: 'dashboard' });

const { clients, loading, fetchClients, deleteClient } = useClients();
const UButton = resolveComponent('UButton')

const isFormOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedClient = ref<Tables<'clients'> | undefined>(undefined);

// Table actions
const handleEdit = (client: Tables<'clients'>) => {
    selectedClient.value = client;
    isFormOpen.value = true;
};

const confirmDelete = (client: Tables<'clients'>) => {
    selectedClient.value = client;
    isDeleteOpen.value = true;
};

// Column definition
const columns: TableColumn<Tables<'clients'>>[] = [
    {
        accessorKey: 'full_name',
        header: 'Nombre del Cliente',
        cell: ({ row }) => h('span', { class: 'font-medium text-white' }, row.original.full_name)
    },
    {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => row.original.phone || 'Sin teléfono'
    },
    {
        accessorKey: 'email',
        header: 'Correo Electrónico',
        cell: ({ row }) => row.original.email || 'Sin correo'
    },
    {
        id: 'actions',
        header: 'Editar/Borrar',
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            return h('div', { class: 'flex justify-start gap-2' }, [
                h(UButton, {
                    icon: 'i-lucide-pen',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => handleEdit(row.original)
                }),
                h(UButton, {
                    icon: 'i-lucide-trash',
                    color: 'error',
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => confirmDelete(row.original)
                })
            ])
        }
    }
];

onMounted(async () => {
    await fetchClients();
});
</script>

<template>
    <UDashboardPanel class="space-y-6 py-5">
        <div class="pb-2 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div>
                <h1 class="text-2xl font-bold text-white">Clientes</h1>
                <p class="text-slate-400 text-sm">Gestiona la base de datos de tus clientes.</p>
            </div>
            <UButton 
            icon="i-lucide-user-plus" label="Añadir cliente" color="primary"
                @click="selectedClient = undefined; isFormOpen = true" />
        </div>

        <div class="flex-1 overflow-y-auto">
            <UTable :data="clients" :columns="columns" :loading="loading" class="w-full" />

            <div v-if="!loading && clients.length === 0" class="py-20 flex flex-col items-center text-center">
                <UIcon name="i-lucide-users" class="size-12 text-slate-700 mb-4" />
                <h3 class="text-white font-medium">No se encontraron clientes</h3>
                <p class="text-slate-500 text-sm mt-1">Intenta con otro término o crea uno nuevo.</p>
            </div>
        </div>


        <UModal v-model:open="isFormOpen">
            <template #content>
                <UCard class="bg-slate-900 border-slate-800">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold text-white">
                                {{ selectedClient ? 'Editar Cliente' : 'Registrar Cliente' }}
                            </h3>
                            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isFormOpen = false" />
                        </div>
                    </template>
                    <ClientsClientForm 
                    :key="selectedClient?.id || 'new'" :initial-data="selectedClient"
                        @success="isFormOpen = false" @cancel="isFormOpen = false" />
                </UCard>
            </template>
        </UModal>

        <SharedConfirmModal 
        v-model:open="isDeleteOpen" title="Eliminar cliente"
            :description="`¿Estás seguro de eliminar a ${selectedClient?.full_name} de la lista de clientes?`" :loading="loading"
            @confirm="async () => { await deleteClient(selectedClient!.id); isDeleteOpen = false; }" />
    </UDashboardPanel>
</template>