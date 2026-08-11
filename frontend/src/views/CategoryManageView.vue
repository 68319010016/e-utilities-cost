<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const activeTab = ref('expense'); // 'expense' หรือ 'budget'
const expenseCategories = ref([]);
const budgetCategories = ref([]);
const loading = ref(true);
const errorMsg = ref('');

// state สำหรับฟอร์มเพิ่ม/แก้ไข
const showForm = ref(false);
const editingId = ref(null);
const formData = ref({ name: '', code: '', unit: 'บาท' });

const fetchCategories = async () => {
  loading.value = true;
  try {
    const [expenseRes, budgetRes] = await Promise.all([
      api.get('/expense-categories'),
      api.get('/budget-categories'),
    ]);
    expenseCategories.value = expenseRes.data;
    budgetCategories.value = budgetRes.data;
  } catch (err) {
    errorMsg.value = 'โหลดข้อมูลไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);

const openCreateForm = () => {
  editingId.value = null;
  formData.value = { name: '', code: '', unit: 'บาท' };
  showForm.value = true;
};

const openEditForm = (item) => {
  editingId.value = item.id;
  formData.value = { name: item.name, code: item.code, unit: item.unit || 'บาท' };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

const handleSubmit = async () => {
  errorMsg.value = '';
  const endpoint = activeTab.value === 'expense' ? '/expense-categories' : '/budget-categories';
  try {
    if (editingId.value) {
      await api.put(`${endpoint}/${editingId.value}`, formData.value);
    } else {
      await api.post(endpoint, formData.value);
    }
    closeForm();
    fetchCategories();
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'บันทึกไม่สำเร็จ';
  }
};

const handleDelete = async (id) => {
  if (!confirm('ยืนยันการลบรายการนี้?')) return;
  const endpoint = activeTab.value === 'expense' ? '/expense-categories' : '/budget-categories';
  try {
    await api.delete(`${endpoint}/${id}`);
    fetchCategories();
  } catch (err) {
    errorMsg.value = 'ลบไม่สำเร็จ';
  }
};
</script>

<template>
  <div class="text-white space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">จัดการประเภท</h1>
      <button @click="openCreateForm"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
        + เพิ่มรายการ
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-700">
      <button @click="activeTab = 'expense'"
        class="px-4 py-2"
        :class="activeTab === 'expense' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'">
        ประเภทค่าใช้จ่าย
      </button>
      <button @click="activeTab = 'budget'"
        class="px-4 py-2"
        :class="activeTab === 'budget' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'">
        หมวดเงิน
      </button>
    </div>

    <p v-if="errorMsg" class="text-red-400">{{ errorMsg }}</p>
    <p v-if="loading" class="text-gray-400">กำลังโหลด...</p>

    <!-- ตาราง Desktop -->
    <table v-else class="w-full hidden md:table bg-gray-800 rounded-lg overflow-hidden">
      <thead class="bg-gray-700 text-left">
        <tr>
          <th class="p-3">ชื่อ</th>
          <th class="p-3">รหัส</th>
          <th v-if="activeTab === 'expense'" class="p-3">หน่วย</th>
          <th class="p-3">สถานะ</th>
          <th class="p-3">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in (activeTab === 'expense' ? expenseCategories : budgetCategories)"
          :key="item.id" class="border-t border-gray-700">
          <td class="p-3">{{ item.name }}</td>
          <td class="p-3">{{ item.code }}</td>
          <td v-if="activeTab === 'expense'" class="p-3">{{ item.unit }}</td>
          <td class="p-3">
            <span :class="item.is_active ? 'text-green-400' : 'text-gray-500'">
              {{ item.is_active ? 'ใช้งาน' : 'ปิดใช้งาน' }}
            </span>
          </td>
          <td class="p-3 space-x-2">
            <button @click="openEditForm(item)" class="text-blue-400 hover:underline">แก้ไข</button>
            <button @click="handleDelete(item.id)" class="text-red-400 hover:underline">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Card list สำหรับมือถือ -->
    <div v-if="!loading" class="md:hidden space-y-2">
      <div v-for="item in (activeTab === 'expense' ? expenseCategories : budgetCategories)"
        :key="item.id" class="bg-gray-800 rounded-lg p-4">
        <div class="flex justify-between">
          <p class="font-semibold">{{ item.name }}</p>
          <span :class="item.is_active ? 'text-green-400' : 'text-gray-500'" class="text-sm">
            {{ item.is_active ? 'ใช้งาน' : 'ปิดใช้งาน' }}
          </span>
        </div>
        <p class="text-gray-400 text-sm">รหัส: {{ item.code }}</p>
        <div class="mt-2 space-x-3">
          <button @click="openEditForm(item)" class="text-blue-400 text-sm">แก้ไข</button>
          <button @click="handleDelete(item.id)" class="text-red-400 text-sm">ลบ</button>
        </div>
      </div>
    </div>

    <!-- Modal ฟอร์ม -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <form @submit.prevent="handleSubmit" class="bg-gray-800 rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 class="text-lg font-bold">{{ editingId ? 'แก้ไขรายการ' : 'เพิ่มรายการ' }}</h2>
        <input v-model="formData.name" placeholder="ชื่อ" required
          class="w-full p-2 rounded bg-gray-700" />
        <input v-model="formData.code" placeholder="รหัส (เช่น ELEC)" required
          class="w-full p-2 rounded bg-gray-700" />
        <input v-if="activeTab === 'expense'" v-model="formData.unit" placeholder="หน่วย"
          class="w-full p-2 rounded bg-gray-700" />
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeForm" class="px-4 py-2 rounded bg-gray-600">ยกเลิก</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600">บันทึก</button>
        </div>
      </form>
    </div>
  </div>
</template>