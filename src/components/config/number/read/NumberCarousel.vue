<script setup>
  import { inject, ref } from 'vue';
  import { NUMBER_BYTES } from '@app/state';
  import NumberDisplay from './NumberDisplay.vue';
  import TabPicker from '../common/TabPicker.vue';

  const bases = [
    [16, 'number.hex'],
    [8, 'number.oct'],
    [10, 'number.dec'],
  ];

  const number = inject(NUMBER_BYTES, ref([0]));
  const base = ref(16);

  const getBase = () => base;
  const getNumber = () => number;
</script>

<template>
  <TabPicker :values="bases" v-model="base" />
  <NumberDisplay :base="getBase()" :number="getNumber()" />
</template>
