<script setup>
  import { provide, ref, watch } from 'vue';
  import LimitedSliderNumber from './util/numeric/LimitedSliderNumber.vue';
  import { useSomeConfig } from './plugin';
  import { CONFIG_RENDERING, HANDLING_CONFIG } from '@app/state';
  import { RENDERER_STANDARD } from '@app/components/shared/constant/rendering';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import RenderingAdjustModal from './modal/RenderingAdjustModal.vue';

  const DEFAULT_COLUMNS = 12;

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
      <ModalCoupler :component="RenderingAdjustModal" v-slot="{ clicked }">
        <button @click="clicked">Test</button>
      </ModalCoupler>
    </div>
  </div>
</template>
