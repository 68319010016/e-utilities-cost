<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.vue';
import CategoryPieChart from '../components/charts/CategoryPieChart.vue';

const year = ref(new Date().getFullYear());
const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const summary = ref(null);
const categories = ref([]);
const loading = ref(true);
const errorMsg = ref('');

const fetchDashboard = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const [summaryRes, categoryRes] = await Promise.all([
      api.get('/dashboard/summary', { params: { year: year.value } }),
      api.get('/dashboard/by-category', { params: { year: year.value } }),
    ]);
    summary.value = summaryRes.data;
    categories.value = categoryRes.data;
  } catch (err) {
    errorMsg.value = 'โหลดข้อมูล dashboard ไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<template>
  <div class="text-white space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <select v-model="year" @change="fetchDashboard"
        class="bg-gray-800 text-white px-3 py-2 rounded">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <p v-if="errorMsg" class="text-red-400">{{ errorMsg }}</p>
    <p v-if="loading" class="text-gray-400">กำลังโหลด...</p>

    <template v-else-if="summary">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-800 rounded-lg p-4">
          <p class="text-gray-400 text-sm">ยอดรวมปี {{ year }}</p>
          <p class="text-2xl font-bold">{{ summary.yearTotal.toLocaleString() }} บาท</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-4">
          <p class="text-gray-400 text-sm">เดือนล่าสุดที่มีข้อมูล</p>
          <p class="text-2xl font-bold">
            {{ summary.months.filter(m => m.total > 0).length }} เดือน
          </p>
        </div>
        <div class="bg-gray-800 rounded-lg p-4">
          <p class="text-gray-400 text-sm">ประเภทที่ใช้จ่ายสูงสุด</p>
          <p class="text-2xl font-bold">
            {{ categories[0]?.name || '-' }}
          </p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-gray-800 rounded-lg p-4">
          <h2 class="mb-3 font-semibold">ยอดรายเดือน</h2>
          <MonthlyBarChart :months="summary.months" />
        </div>
        <div class="bg-gray-800 rounded-lg p-4">
          <h2 class="mb-3 font-semibold">สัดส่วนแยกตามประเภท</h2>
          <CategoryPieChart :categories="categories.filter(c => c.total > 0)" />
        </div>
      </div>
    </template>
  </div>
</template>