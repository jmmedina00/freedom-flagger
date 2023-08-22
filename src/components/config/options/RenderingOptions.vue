<script setup>
  import { ref, watch } from 'vue';
  import LimitedSliderNumber from './util/numeric/LimitedSliderNumber.vue';
  import { useSomeConfig } from './plugin';
  import { CONFIG_RENDERING } from '@app/state';
  import {
    DECORATE_INFINITE,
    RENDERER_DECORATE,
    RENDERER_DIVIDED,
    RENDERER_STANDARD,
  } from '@app/components/shared/constant/rendering';
  import IconOption from './util/icon/IconOption.vue';
  import { TOP_RIGHT } from '@app/components/shared/decorate/corner';

  const DEFAULT_COLUMNS = 12;

  const renderers = [
    { value: RENDERER_STANDARD, icon: 'work' },
    { value: RENDERER_DIVIDED, icon: 'pets' },
    { value: RENDERER_DECORATE, icon: 'explore' },
  ];

  const renderingConfig = useSomeConfig(CONFIG_RENDERING, {
    columnsLimited: false,
    columnsMax: DEFAULT_COLUMNS,
    renderer: RENDERER_STANDARD,
    params: {},
  });

  const maxColumns = ref(renderingConfig.value.columnsMax || DEFAULT_COLUMNS);
  const enabled = ref(renderingConfig.value.columnsLimited || false);
  const selectedRenderer = ref(
    renderingConfig.value.renderer || RENDERER_STANDARD
  );

  const testParams = {
    [RENDERER_STANDARD]: {},
    [RENDERER_DIVIDED]: {
      mainFlagPercent: 40,
    },
    [RENDERER_DECORATE]: {
      decorate: DECORATE_INFINITE,
      decorateConfig: {
        size: 15,
        corner: TOP_RIGHT,
      },
    },
  };

  watch(
    [enabled, maxColumns, selectedRenderer],
    ([columnsLimited, columnsMax, renderer]) => {
      renderingConfig.value = {
        columnsLimited,
        columnsMax: parseInt(columnsMax),
        renderer,
        params: testParams[renderer],
      };
    }
  );
</script>

<template>
  <div>
    <div class="mb-1">
      <input id="enabled" type="checkbox" class="switch" v-model="enabled" />
      <label for="enabled">{{ $t('options.columns.limit') }}</label>
    </div>
    <div v-if="enabled">
      <h5 class="mb-1">
        {{ $t('options.columns.max') + ':' }}
      </h5>
      <LimitedSliderNumber v-model="maxColumns" :min="1" :max="32" />
      <h6 class="mb-1">{{ $t('renderer.title') }}:</h6>
      <p>
        <IconOption
          v-for="{ value, icon } in renderers"
          :id="'render-' + value"
          :value="value"
          :label="'renderer.' + value"
          :icon="icon"
          v-model="selectedRenderer"
        />
      </p>
    </div>
  </div>
</template>
