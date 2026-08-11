<script setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  categories: { type: Array, required: true }, // [{ name, total }, ...]
});

const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const chartData = {
  labels: props.categories.map(c => c.name),
  datasets: [{
    data: props.categories.map(c => c.total),
    backgroundColor: colors,
  }],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#e5e7eb' } },
  },
};
</script>

<template>
  <div style="height: 300px">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>