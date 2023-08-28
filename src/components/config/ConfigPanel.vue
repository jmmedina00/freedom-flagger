<script setup>
  import ConfigSummary from './options/ConfigSummary.vue';
  import NumberSection from './number/NumberSection.vue';

  const testConfig = { foo: 'bar' };
</script>

<template>
  <nav class="flex-column is-flex-grow-1">
    <ConfigSummary
      v-bind="testConfig"
      class="combined-subpanel is-flex-grow-1"
    />
    <NumberSection class="combined-subpanel smaller is-flex-shrink-1" />
  </nav>
</template>

<style lang="scss">
  @import '../../style/bulma';

  nav {
    $width: 360px;
    width: $width;
    min-width: 360px;
    max-width: $width;

    @include mobile {
      width: 100%;
      max-width: none;
    }
  }

  .flex-column {
    @extend .is-flex;
    @extend .is-flex-direction-column;
  }

  .combined-subpanel {
    overflow-y: auto;
  }

  .smaller {
    max-height: 45%;
  }
</style>
