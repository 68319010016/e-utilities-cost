<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p>ยินดีต้อนรับ, {{ authStore.user?.full_name }}</p>
  </div>
</template>