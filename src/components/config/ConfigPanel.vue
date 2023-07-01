<script setup>
  import ConfigSummary from './options/ConfigSummary.vue';
  import NumberEditor from './number/NumberEditor.vue';

  const testConfig = { foo: 'bar' };
</script>

<template>
  <nav class="flex-column is-flex-grow-1">
    <ConfigSummary
      v-bind="testConfig"
      class="has-background-info combined-subpanel"
    />
    <NumberEditor class="has-background-success combined-subpanel" />
  </nav>
</template>

<style scoped lang="scss">
  @import '../../style/bulma';

  nav {
    $width: 360px;
    width: $width;
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
    @extend .is-flex-grow-1;
    overflow-y: auto;
  }
</style>
