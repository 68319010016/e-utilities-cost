<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const menu = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'รายการค่าใช้จ่าย', path: '/expenses', icon: '💰' },
  { name: 'จัดการประเภท', path: '/settings/categories', icon: '⚙️' },
];

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <aside class="w-64 bg-gray-800 min-h-screen flex flex-col text-white">
    <div class="p-4 border-b border-gray-700">
      <h1 class="text-lg font-bold">e-utilities-cost</h1>
      <p class="text-sm text-gray-400">{{ authStore.user?.full_name }}</p>
    </div>

    <nav class="flex-1 p-2 space-y-1">
      <router-link
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-700': route.path === item.path }"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="p-2 border-t border-gray-700">
      <button @click="handleLogout"
        class="w-full text-left px-3 py-2 rounded hover:bg-red-600">
        ออกจากระบบ
      </button>
    </div>
  </aside>
</template>