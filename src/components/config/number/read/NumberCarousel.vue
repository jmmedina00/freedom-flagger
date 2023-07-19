<script setup>
  import { inject, ref } from 'vue';
  import { NUMBER_BYTES } from '@app/state';
  import NumberDisplay from './NumberDisplay.vue';

  const number = inject(NUMBER_BYTES, ref([0]));
  const base = ref(16);

  const getBase = () => base;
  const getNumber = () => number;
</script>

<template>
  <p>
    <input type="radio" id="hex" :value="16" v-model="base" />
    <label for="hex">{{ $t('bytes.hex') }}</label>

    <input type="radio" id="dec" :value="10" v-model="base" />
    <label for="dec">{{ $t('bytes.dec') }}</label>

    <input type="radio" id="bin" :value="2" v-model="base" />
    <label for="bin">{{ $t('bytes.bin') }}</label>
  </p>

  <NumberDisplay :base="getBase()" :number="getNumber()" />
</template>
