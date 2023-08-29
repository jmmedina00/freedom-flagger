<script setup>
  import { computed } from 'vue';
  import { useSomeConfig } from './plugin';
  import { CONFIG_RENDERING } from '@app/state';
  import {
    RENDERER_DECORATE,
    RENDERER_DIVIDED,
    RENDERER_ICONS,
    RENDERER_STANDARD,
  } from '@app/components/shared/constant/rendering';
  import LimitedSliderNumber from './util/numeric/LimitedSliderNumber.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import RenderingAdjustModal from './modal/RenderingAdjustModal.vue';
  import OptionButton from './OptionButton.vue';

  const DEFAULT_COLUMNS = 12;

  const significantGetters = {
    [RENDERER_STANDARD]: () => 'std',
    [RENDERER_DIVIDED]: (params) => params.mainFlagPercent + '%',
    [RENDERER_DECORATE]: (params) => params.decorate,
  };

  const renderingConfig = useSomeConfig(CONFIG_RENDERING, {
    columnsLimited: false,
    columnsMax: DEFAULT_COLUMNS,
    renderer: RENDERER_STANDARD,
    params: {},
  });
  const renderer = computed(() => renderingConfig.value.renderer);

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
    <div class="mb-3">
      <input id="enabled" type="checkbox" class="switch" v-model="enabled" />
      <label for="enabled">{{ $t('options.columns.limit') }}</label>
    </div>
    <div v-if="enabled">
      <h5 class="mb-2">
        {{ $t('options.columns.max') + ':' }}
      </h5>
      <p class="mb-1">
        <LimitedSliderNumber v-model="maxColumns" :min="1" :max="32" />
      </p>

      <ModalCoupler :component="RenderingAdjustModal" v-slot="{ clicked }">
        <OptionButton
          @click="clicked"
          :icon="RENDERER_ICONS[renderer]"
          :primary="$t('renderer.' + renderer)"
          :secondary="significantGetters[renderer](renderingConfig.params)"
          :data-tooltip="$t('renderer.title')"
          :aria-label="$t('renderer.title')"
          class="has-tooltip-arrow"
        />
      </ModalCoupler>
    </div>
  </div>
</template>
