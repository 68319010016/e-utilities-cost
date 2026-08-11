<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMsg.value = '';
  try {
    await authStore.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <form @submit.prevent="handleLogin" class="bg-gray-800 p-8 rounded-lg w-80 space-y-4">
      <h1 class="text-white text-xl font-bold">เข้าสู่ระบบ</h1>
      <input v-model="username" type="text" placeholder="Username"
        class="w-full p-2 rounded bg-gray-700 text-white" />
      <input v-model="password" type="password" placeholder="Password"
        class="w-full p-2 rounded bg-gray-700 text-white" />
      <p v-if="errorMsg" class="text-red-400 text-sm">{{ errorMsg }}</p>
      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        เข้าสู่ระบบ
      </button>
    </form>
  </div>
</template>