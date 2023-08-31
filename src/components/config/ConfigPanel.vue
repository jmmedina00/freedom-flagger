<script setup>
  import ConfigSummary from './options/ConfigSummary.vue';
  import NumberSection from './number/NumberSection.vue';

  const testConfig = { foo: 'bar' };
</script>

<template>
  <nav class="is-flex is-flex-direction-column is-flex-grow-1">
    <ConfigSummary
      v-bind="testConfig"
      class="combined-subpanel is-flex-grow-1"
    />
    <NumberSection class="combined-subpanel smaller is-flex-shrink-1" />
  </nav>
</template>

<style>
  nav {
    width: 360px;
    min-width: 360px;
    max-width: 360px;
  }

  .combined-subpanel {
    overflow-y: auto;
  }

  .smaller {
    max-height: 45%;
  }
</style>
