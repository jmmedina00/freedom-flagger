<script setup>
  import { computed, provide, ref, watch } from 'vue';
  import LimitedSliderNumber from './util/numeric/LimitedSliderNumber.vue';
  import { useSomeConfig } from './plugin';
  import { CONFIG_RENDERING, HANDLING_CONFIG } from '@app/state';
  import {
    RENDERER_DECORATE,
    RENDERER_DIVIDED,
    RENDERER_STANDARD,
  } from '@app/components/shared/constant/rendering';
  import IconOption from './util/icon/IconOption.vue';
  import DivideLineSubpanel from './subpanel/DivideLineSubpanel.vue';
  import DecorateSubpanel from './subpanel/DecorateSubpanel.vue';

  const DEFAULT_COLUMNS = 12;

  const renderers = [
    { value: RENDERER_STANDARD, icon: 'work' },
    { value: RENDERER_DIVIDED, icon: 'pets' },
    { value: RENDERER_DECORATE, icon: 'explore' },
  ];

  const panels = {
    [RENDERER_STANDARD]: null,
    [RENDERER_DIVIDED]: DivideLineSubpanel,
    [RENDERER_DECORATE]: DecorateSubpanel,
  };

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

  const currentPanel = computed(() => panels[selectedRenderer.value]);

  const handlingConfig = ref({
    component: selectedRenderer.value,
    config: renderingConfig.value.params || {},
  });

  provide(HANDLING_CONFIG, handlingConfig);

  watch(
    handlingConfig,
    (handling) => {
      const current = renderingConfig.value;
      renderingConfig.value = {
        ...current,
        params:
          current.renderer === RENDERER_STANDARD ? {} : { ...handling.config },
      };
    },
    { deep: true }
  );

  watch(
    [enabled, maxColumns, selectedRenderer],
    ([columnsLimited, columnsMax, renderer]) => {
      renderingConfig.value = {
        ...renderingConfig.value,
        columnsLimited,
        columnsMax: parseInt(columnsMax),
        renderer,
        params:
          renderer === RENDERER_STANDARD
            ? {}
            : { ...handlingConfig.value.config },
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
      <component v-if="currentPanel" :is="currentPanel" />
    </div>
  </div>
</template>
