<script setup lang="ts">
import { z } from 'zod';

const supabase = useSupabaseClient();
const loading = ref(false);
// Simple validation schema
const schema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria')
});

const state = reactive({
    email: '',
    password: ''
});

async function onSubmit() {
    const result = schema.safeParse(state);

    if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        alert(firstIssue?.message || 'Validation error');
        return;
    }
    loading.value = true;

    try {
        schema.parse({
            email: state.email,
            password: state.password
        });

        const { error } = await supabase.auth.signInWithPassword({
            email: state.email,
            password: state.password,
        });

        if (error) throw error

        await navigateTo('/app')
    } catch (error) {
        alert(getSupabaseErrorMessage(error));
    } finally {
        loading.value = false
    }
}
// If the user is already logged in, it redirect him to the dashboard
const user = useSupabaseUser();
watchEffect(() => {
    if (user.value) {
        navigateTo('/app/dashboard');
    }
});
</script>

<template>
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <UCard class="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
            <template #header>
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-white">Bienvenido de nuevo a <span class="text-emerald-500">Vexo</span></h1>
                    <p class="text-slate-400 text-sm">Ingresa a tu panel de control</p>
                </div>
            </template>

            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField class="w-full" label="Email" name="email">
                    <UInput v-model="state.email" type="email" class="w-full" icon="i-heroicons-envelope" color="primary" />
                </UFormField>

                <UFormField class="w-full" label="Contraseña" name="password">
                    <UInput v-model="state.password" type="password" class="w-full" icon="i-heroicons-lock-closed" color="primary" />
                </UFormField>

                <UButton type="submit" block color="primary" :loading="loading" size="lg">
                    Iniciar Sesión
                </UButton>
            </UForm>

            <template #footer>
                <p class="text-center text-sm text-slate-500">
                    ¿No tienes una cuenta?
                    <NuxtLink to="/register" class="text-emerald-500 font-medium">Regístrate aquí</NuxtLink>
                </p>
            </template>
        </UCard>
    </div>
</template>