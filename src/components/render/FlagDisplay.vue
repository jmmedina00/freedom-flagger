<script setup>
  import { inject } from 'vue';
  import { CONFIG, NUMBER_BYTES } from '../../state';

  const config = inject(CONFIG);

  const number = inject(NUMBER_BYTES);
</script>

<template>
  <svg
    version="1.1"
    width="300"
    height="200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="50%" height="50%" fill="red"></rect>
    <rect width="50%" height="50%" x="50%" y="50%" fill="blue"></rect>
    <text x="20" y="20">{{ config.number }}</text>
    <text x="40" y="40">{{ number }}</text>
  </svg>
</template>
