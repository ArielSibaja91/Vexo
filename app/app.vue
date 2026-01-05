<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm bg-slate-900 border-slate-800">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-bolt-20-solid" class="w-6 h-6 text-emerald-400" />
          <h1 class="text-xl font-bold text-white">Vexo Dashboard</h1>
        </div>
      </template>

      <p class="text-slate-400 mb-4">
        Welcome to Vexo!
      </p>

      <UButton color="primary" variant="solid" block icon="i-heroicons-arrow-right-20-solid">
        Empezar ahora
      </UButton>
    </UCard>
  </div>
</template>