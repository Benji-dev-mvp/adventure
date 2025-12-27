<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Vue Widget' },
  initial: { type: Number, default: 0 }
})

const count = ref(props.initial)
</script>

<template>
  <div class="rounded-xl border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-2">
      <h4 class="text-sm font-semibold text-gray-900">{{ title }}</h4>
      <span class="text-xs text-gray-500">Vue 3</span>
    </div>
    <p class="text-sm text-gray-700 mb-3">Count: <span class="font-mono">{{ count }}</span></p>
    <div class="flex gap-2">
      <button class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700" @click="count++">Increment</button>
      <button class="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-sm hover:bg-gray-200" @click="count = 0">Reset</button>
    </div>
  </div>
</template>

<style scoped>
/* Keep styles minimal and scoped to avoid leaking into React */
</style>
