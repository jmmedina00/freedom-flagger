<script setup>
  import ConfigSummary from './flag/ConfigSummary.vue';
  import NumberEditor from './flag/NumberEditor.vue';
  import PanelBar from './settings/PanelBar.vue';

  const testConfig = { foo: 'bar' };
</script>

<template>
  <nav class="flex-column">
    <PanelBar />
    <div class="flex-column is-flex-grow-1">
      <ConfigSummary
        v-bind="testConfig"
        class="has-background-info combined-subpanel"
      />
      <NumberEditor class="has-background-success combined-subpanel" />
    </div>
  </nav>
</template>

<style scoped lang="scss">
  @import '../../style/bulma';

  nav {
    width: 360px;

    @include mobile {
      width: 100%;
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
