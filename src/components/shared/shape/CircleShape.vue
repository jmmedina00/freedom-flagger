<script setup>
  const props = defineProps(['size', 'x', 'y']);
</script>

<template>
  <circle :cx="x" :cy="y" :r="size"></circle>
</template>
