<script setup>
  import {
    DECORATE_COMPONENTS,
    DECORATE_MOSAIC,
  } from '@app/components/shared/constant/rendering';
  import { DECORATE_CONFIG, RENDER_BASICS, RENDER_PARAMS } from '@app/state';
  import { computed, inject, provide, ref } from 'vue';
  import FlagPortion from '../core/FlagPortion.vue';

  const props = defineProps([
    'portions',
    'direction',
    'decorate',
    'decorateConfig',
  ]);

  const { portions, direction } = inject(RENDER_BASICS, {
    portions: ref([]),
    direction: ref(''),
  });

  const params = inject(
    RENDER_PARAMS,
    ref({ decorate: DECORATE_MOSAIC, decorateConfig: {} })
  );
  const decorate = computed(() => params.value?.decorate);
  const decorateConfig = computed(() => params.value?.decorateConfig);

  const uniqueLengths = computed(
    () => new Set(portions.value.map((x) => x.length)).size
  );

  const decoratePortion = computed(() =>
    uniqueLengths.value > 1 ? portions.value.at(-1) : null
  );
  const flagPortions = computed(() =>
    uniqueLengths.value > 1 ? portions.value.slice(0, -1) : [...portions.value]
  );

  const decorateComponent = computed(() => DECORATE_COMPONENTS[decorate.value]);

  const fullConfig = computed(() => ({
    ...decorateConfig.value,
    colors: decoratePortion.value || [],
  }));
  provide(DECORATE_CONFIG, fullConfig);
</script>

<template>
  <FlagPortion
    v-for="(portion, index) in flagPortions"
    :key="portion.toString() + '-' + index + '-' + direction"
    :colors="portion"
    :index="index"
    :total="flagPortions.length"
    :direction="direction"
  />
  <component v-if="decoratePortion" :is="decorateComponent" />
</template>
