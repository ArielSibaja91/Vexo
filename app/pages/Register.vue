<script setup lang="ts">
import { z } from 'zod'

const supabase = useSupabaseClient()
const loading = ref(false)

// Simple validation schema
const schema = z.object({
    businessName: z.string().min(3, 'El nombre del negocio es muy corto'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const state = reactive({
    businessName: '',
    email: '',
    password: ''
})

async function onSubmit() {
    loading.value = true

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: state.email,
            password: state.password,
        })

        if (authError) throw authError

        await supabase.auth.getSession();

        if (!authData.user) throw new Error('No se pudo crear el usuario')

        const slug = state.businessName.toLowerCase().trim().replace(/\s+/g, '-')

        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
                name: state.businessName,
                slug: slug
            })
            .select()
            .single()

        if (orgError) throw orgError

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                organization_id: orgData.id,
                full_name: 'Administrador',
                role: 'admin'
            })

        if (profileError) throw profileError

        navigateTo('/app/dashboard')

    } catch (error: any) {
        alert(error.message || 'Ocurrió un error inesperado')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <UCard class="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
            <template #header>
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-white">Bienvenido a <span class="text-emerald-500">Vexo</span>
                    </h1>
                    <p class="text-slate-400 text-sm">Crea tu cuenta de negocio hoy</p>
                </div>
            </template>

            <UForm class="flex flex-col gap-2 justify-center items-center w-full" :schema="schema" :state="state" @submit="onSubmit">
                <UFormField 
                class="w-full"
                label="Nombre de tu Negocio" name="businessName"
                    help="Este será el nombre público de tu local">
                    <UInput 
                    v-model="state.businessName" placeholder="Ej: Barbería El Greco"
                    class="w-full"
                        icon="i-heroicons-building-storefront" color="primary" />
                </UFormField>

                <UFormField 
                class="w-full"
                label="Email profesional" name="email">
                    <UInput 
                    v-model="state.email" type="email" placeholder="admin@negocio.com"
                    class="w-full"
                        icon="i-heroicons-envelope" color="primary" />
                </UFormField>

                <UFormField
                class="w-full"
                label="Contraseña" name="password">
                    <UInput 
                    v-model="state.password" type="password" placeholder="••••••••"
                    class="w-full"
                        icon="i-heroicons-lock-closed" color="primary" />
                </UFormField>

                <UButton type="submit" block color="primary" :loading="loading" size="lg">
                    Registrar mi Negocio
                </UButton>
            </UForm>

            <template #footer>
                <p class="text-center text-sm text-slate-500">
                    ¿Ya tienes cuenta? <NuxtLink to="/login" class="text-emerald-500 font-medium">Inicia sesión
                    </NuxtLink>
                </p>
            </template>
        </UCard>
    </div>
</template>