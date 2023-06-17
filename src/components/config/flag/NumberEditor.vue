<script setup>
  import { computed, ref } from 'vue';
  import DiscreteIcon from '../../shared/DiscreteIcon.vue';

  const expanded = ref(false);

  const toggleExpanded = () => {
    expanded.value = !expanded.value;
  };

  const buttonLocale = computed(() => (expanded.value ? 'down' : 'up'));
  const buttonIcon = computed(
    () => 'keyboard_double_arrow_' + buttonLocale.value
  );
</script>

<template>
  <div :class="{ expanded, collapsed: !expanded }">
    <span>Tabs</span>
    <button class="button" @click="toggleExpanded">
      <DiscreteIcon :icon="buttonIcon" />
    </button>
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
