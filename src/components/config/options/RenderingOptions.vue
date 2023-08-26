<script setup>
  import { computed } from 'vue';
  import { useSomeConfig } from './plugin';
  import { CONFIG_RENDERING } from '@app/state';
  import { RENDERER_STANDARD } from '@app/components/shared/constant/rendering';
  import LimitedSliderNumber from './util/numeric/LimitedSliderNumber.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import RenderingAdjustModal from './modal/RenderingAdjustModal.vue';

  const DEFAULT_COLUMNS = 12;

  const renderingConfig = useSomeConfig(CONFIG_RENDERING, {
    columnsLimited: false,
    columnsMax: DEFAULT_COLUMNS,
    renderer: RENDERER_STANDARD,
    params: {},
  });

  const maxColumns = computed({
    get: () => renderingConfig.value?.columnsMax,
    set: (value) => {
      renderingConfig.value = {
        ...renderingConfig.value,
        columnsMax: parseInt(value),
      };
    },
  });

  const enabled = computed({
    get: () => renderingConfig.value?.columnsLimited,
    set: (value) => {
      renderingConfig.value = {
        ...renderingConfig.value,
        columnsLimited: !!value,
      };
    },
  });
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
