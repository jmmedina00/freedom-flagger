<script setup>
  import { computed, ref } from 'vue';

  const expanded = ref(false);

  const toggleExpanded = () => {
    expanded.value = !expanded.value;
  };

  const buttonLocale = computed(() => (expanded.value ? 'collapse' : 'expand'));
</script>

<template>
  <div :class="{ expanded, collapsed: !expanded }">
    <span>Tabs</span>
    <button @click="toggleExpanded">{{ $t(buttonLocale) }}</button>
  </div>
</template>

<style scoped>
  .collapsed {
    max-height: 100px;
  }

  .expanded {
    min-height: 200px;
  }
</style>
