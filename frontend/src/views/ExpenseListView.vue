<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

const expenses = ref([]);
const expenseCategories = ref([]);
const budgetCategories = ref([]);
const loading = ref(true);
const errorMsg = ref('');

// ตัวกรอง
const filterYear = ref(new Date().getFullYear());
const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const filterMonth = ref('');
const filterExpenseCategory = ref('');

// ฟอร์ม
const showForm = ref(false);
const editingId = ref(null);
const formData = ref({
  expense_category_id: '',
  budget_category_id: '',
  amount: '',
  billing_month: '',
  paid_date: '',
  invoice_no: '',
  note: '',
});

const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const fetchCategories = async () => {
  const [expRes, budRes] = await Promise.all([
    api.get('/expense-categories'),
    api.get('/budget-categories'),
  ]);
  expenseCategories.value = expRes.data;
  budgetCategories.value = budRes.data;
};

const fetchExpenses = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const params = { year: filterYear.value };
    if (filterMonth.value) params.month = filterMonth.value;
    if (filterExpenseCategory.value) params.expense_category_id = filterExpenseCategory.value;

    const res = await api.get('/expenses', { params });
    expenses.value = res.data;
  } catch (err) {
    errorMsg.value = 'โหลดข้อมูลไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchExpenses();
});

const openCreateForm = () => {
  editingId.value = null;
  formData.value = {
    expense_category_id: '', budget_category_id: '', amount: '',
    billing_month: '', paid_date: '', invoice_no: '', note: '',
  };
  showForm.value = true;
};

const openEditForm = (item) => {
  editingId.value = item.id;
  formData.value = {
    expense_category_id: item.expense_category_id,
    budget_category_id: item.budget_category_id,
    amount: item.amount,
    billing_month: item.billing_month,
    paid_date: item.paid_date || '',
    invoice_no: item.invoice_no || '',
    note: item.note || '',
  };
  showForm.value = true;
};

const closeForm = () => { showForm.value = false; };

const handleSubmit = async () => {
  errorMsg.value = '';
  try {
    if (editingId.value) {
      await api.put(`/expenses/${editingId.value}`, formData.value);
    } else {
      await api.post('/expenses', formData.value);
    }
    closeForm();
    fetchExpenses();
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'บันทึกไม่สำเร็จ';
  }
};

const handleDelete = async (id) => {
  if (!confirm('ยืนยันการลบรายการนี้?')) return;
  try {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  } catch (err) {
    errorMsg.value = 'ลบไม่สำเร็จ';
  }
};

const formatMonth = (dateStr) => {
  const d = new Date(dateStr);
  return `${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`; // แสดงเป็น พ.ศ.
};

const totalAmount = computed(() =>
  expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
);
</script>

<template>
  <div class="text-white space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <h1 class="text-2xl font-bold">รายการค่าใช้จ่าย</h1>
      <button @click="openCreateForm"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
        + เพิ่มรายการ
      </button>
    </div>

    <!-- ตัวกรอง -->
    <div class="flex flex-wrap gap-2 bg-gray-800 p-4 rounded-lg">
      <select v-model="filterYear" @change="fetchExpenses" class="bg-gray-700 px-3 py-2 rounded">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
      </select>
      <select v-model="filterMonth" @change="fetchExpenses" class="bg-gray-700 px-3 py-2 rounded">
        <option value="">ทุกเดือน</option>
        <option v-for="(m, i) in monthNames" :key="i" :value="i + 1">{{ m }}</option>
      </select>
      <select v-model="filterExpenseCategory" @change="fetchExpenses" class="bg-gray-700 px-3 py-2 rounded">
        <option value="">ทุกประเภท</option>
        <option v-for="c in expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <p v-if="errorMsg" class="text-red-400">{{ errorMsg }}</p>
    <p v-if="loading" class="text-gray-400">กำลังโหลด...</p>

    <template v-else>
      <p class="text-gray-400">ยอดรวมที่กรอง: <span class="text-white font-bold">{{ totalAmount.toLocaleString() }} บาท</span> ({{ expenses.length }} รายการ)</p>

      <!-- ตาราง Desktop -->
      <table class="w-full hidden md:table bg-gray-800 rounded-lg overflow-hidden">
        <thead class="bg-gray-700 text-left">
          <tr>
            <th class="p-3">เดือนบิล</th>
            <th class="p-3">ประเภท</th>
            <th class="p-3">หมวดเงิน</th>
            <th class="p-3">จำนวนเงิน</th>
            <th class="p-3">เลขที่ใบแจ้งหนี้</th>
            <th class="p-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in expenses" :key="item.id" class="border-t border-gray-700">
            <td class="p-3">{{ formatMonth(item.billing_month) }}</td>
            <td class="p-3">{{ item.expenseCategory?.name }}</td>
            <td class="p-3">{{ item.budgetCategory?.name }}</td>
            <td class="p-3">{{ Number(item.amount).toLocaleString() }} บาท</td>
            <td class="p-3">{{ item.invoice_no || '-' }}</td>
            <td class="p-3 space-x-2">
              <button @click="openEditForm(item)" class="text-blue-400 hover:underline">แก้ไข</button>
              <button @click="handleDelete(item.id)" class="text-red-400 hover:underline">ลบ</button>
            </td>
          </tr>
          <tr v-if="expenses.length === 0">
            <td colspan="6" class="p-6 text-center text-gray-500">ไม่มีรายการ</td>
          </tr>
        </tbody>
      </table>

      <!-- Card list มือถือ -->
      <div class="md:hidden space-y-2">
        <div v-for="item in expenses" :key="item.id" class="bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between">
            <p class="font-semibold">{{ item.expenseCategory?.name }}</p>
            <p class="font-bold">{{ Number(item.amount).toLocaleString() }} บาท</p>
          </div>
          <p class="text-gray-400 text-sm">{{ formatMonth(item.billing_month) }} · {{ item.budgetCategory?.name }}</p>
          <div class="mt-2 space-x-3">
            <button @click="openEditForm(item)" class="text-blue-400 text-sm">แก้ไข</button>
            <button @click="handleDelete(item.id)" class="text-red-400 text-sm">ลบ</button>
          </div>
        </div>
        <p v-if="expenses.length === 0" class="text-center text-gray-500 py-6">ไม่มีรายการ</p>
      </div>
    </template>

    <!-- Modal ฟอร์ม -->
    <div v-if="showForm" class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 overflow-auto">
      <form @submit.prevent="handleSubmit" class="bg-gray-800 rounded-lg p-6 w-full max-w-md space-y-3 my-8">
        <h2 class="text-lg font-bold">{{ editingId ? 'แก้ไขรายการ' : 'เพิ่มรายการค่าใช้จ่าย' }}</h2>

        <label class="block text-sm text-gray-400">ประเภทค่าใช้จ่าย</label>
        <select v-model="formData.expense_category_id" required class="w-full p-2 rounded bg-gray-700">
          <option value="" disabled>เลือกประเภท</option>
          <option v-for="c in expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>

        <label class="block text-sm text-gray-400">หมวดเงินที่เบิก</label>
        <select v-model="formData.budget_category_id" required class="w-full p-2 rounded bg-gray-700">
          <option value="" disabled>เลือกหมวดเงิน</option>
          <option v-for="b in budgetCategories" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>

        <label class="block text-sm text-gray-400">จำนวนเงิน (บาท)</label>
        <input v-model="formData.amount" type="number" step="0.01" required
          class="w-full p-2 rounded bg-gray-700" />

        <label class="block text-sm text-gray-400">เดือน/ปีของบิล</label>
        <input v-model="formData.billing_month" type="date" required
          class="w-full p-2 rounded bg-gray-700" />

        <label class="block text-sm text-gray-400">วันที่ชำระจริง (ถ้ามี)</label>
        <input v-model="formData.paid_date" type="date"
          class="w-full p-2 rounded bg-gray-700" />

        <label class="block text-sm text-gray-400">เลขที่ใบแจ้งหนี้ (ถ้ามี)</label>
        <input v-model="formData.invoice_no" type="text"
          class="w-full p-2 rounded bg-gray-700" />

        <label class="block text-sm text-gray-400">หมายเหตุ</label>
        <textarea v-model="formData.note" rows="2"
          class="w-full p-2 rounded bg-gray-700"></textarea>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="closeForm" class="px-4 py-2 rounded bg-gray-600">ยกเลิก</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600">บันทึก</button>
        </div>
      </form>
    </div>
  </div>
</template>