<template>
  <div>
    <Cell title="选择单个日期" :value="date" @click="show = true" ></Cell>
    <Calendar v-model="show" @confirm="onConfirm" ></Calendar>
  </div>
</template>
<script>
import { Cell, Calendar } from 'vant';
export default {
  data() {
    return {
      date: '',
      show: false,
    }
  },
  components: {
    Calendar,
    Cell
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
    }
  }
}
</script>