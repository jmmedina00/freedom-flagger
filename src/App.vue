<script setup>
  import ConfigPanel from './components/config/ConfigPanel.vue';
  import RenderPanel from './components/render/RenderPanel.vue';
</script>

<template>
  <div class="is-flex">
    <RenderPanel class="is-hidden-mobile" />
    <ConfigPanel />
  </div>
</template>

<style scoped>
  div {
    height: 100%;
  }
</style>
