<script setup>
  import { computed, ref } from 'vue';
  import PanelBar from '../shared/PanelBar.vue';
  import NumberSummary from './NumberSummary.vue';
  import NumberCarousel from './read/NumberCarousel.vue';
  import IconButton from '../../shared/IconButton.vue';

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
  <div class="bottom-pad">
    <PanelBar :name="$t('tabs')" color="info">
      <IconButton :icon="buttonIcon" @click="toggleExpanded" />
    </PanelBar>
    <NumberSummary v-if="expanded" />
    <NumberCarousel v-else />
  </div>
</template>

<style scoped>
  .bottom-pad {
    padding-bottom: 3em;
  }
</style>
