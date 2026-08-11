<script setup>
import Sidebar from './Sidebar.vue';
</script>

<template>
  <div class="flex bg-gray-900 min-h-screen">
    <Sidebar />
    <main class="flex-1 p-6 overflow-auto">
      <router-view />
    </main>
  </div>
</template>