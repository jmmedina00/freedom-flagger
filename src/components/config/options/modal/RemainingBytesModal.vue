<script setup>
  import DemoMiniFlag from '../util/demo/DemoMiniFlag.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';
  import { computed, inject, provide, ref } from 'vue';
  import {
    CONFIG_REMAINDER,
    DECORATE_CONFIG,
    HANDLING_CONFIG,
    MODAL_ACTIVE,
  } from '@app/state';
  import IconOption from '../util/icon/IconOption.vue';
  import MosaicSubpanel from '../subpanel/MosaicSubpanel.vue';
  import CornerTriangleSubpanel from '../subpanel/CornerTriangleSubpanel.vue';
  import BorderSubpanel from '../subpanel/BorderSubpanel.vue';
  import HexSubpanel from '../subpanel/HexSubpanel.vue';
  import { placeColorsOnIndexes } from '@app/components/shared/color-index';
  import {
    REMAINDER_COMPONENTS,
    REMAINDER_ICONS,
    REM_BORDER,
    REM_HEX,
    REM_MOSAIC,
    REM_TRIANGLE,
  } from '@app/components/shared/constant/remainder';
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { useSomeConfig } from '../plugin';
  import { COLOR_FG_SEQUENCE } from '../util/demo/color';

  const SUBPANELS = {
    [REM_MOSAIC]: MosaicSubpanel,
    [REM_TRIANGLE]: CornerTriangleSubpanel,
    [REM_BORDER]: BorderSubpanel,
    [REM_HEX]: HexSubpanel,
  };
  const MAX_SCALED_DIMENSION = 200;
  const SAMPLE_COLORS = COLOR_FG_SEQUENCE.slice(0, 3);
  const DECORATES = Object.keys(SUBPANELS);

  const state = useSomeConfig(CONFIG_REMAINDER, {
    component: REM_MOSAIC,
    config: {},
    colorChoices: 2,
  });
  const isActive = inject(MODAL_ACTIVE, ref(true));
  const sizing = useFullStateSize();
  const handlingConfig = ref({ colorChoices: 2, ...state.value });

  const activeSubpanel = ref(handlingConfig.value.component);
  const activeComponent = computed(
    () => REMAINDER_COMPONENTS[activeSubpanel.value]
  );

  const complexColorsEnabled = computed({
    get: () => (handlingConfig.value.colorChoices || 2) === 3,
    set: (value) => {
      handlingConfig.value = {
        ...handlingConfig.value,
        colorChoices: 2 + value,
      };
    },
  });

  const decorateConfig = computed(() => {
    const {
      config,
      proportional = [],
      adapted = [],
      colorChoices = 2,
    } = handlingConfig.value;
    if (!config) return {};

    const { width, height } = sizing.value;
    const largerDimension = Math.max(width, height);
    const providedColors = SAMPLE_COLORS.slice(0, colorChoices);

    return {
      ...placeColorsOnIndexes(config, {
        colors: providedColors,
        fields: adapted,
        scaled: [...proportional],
        scaleRatio: MAX_SCALED_DIMENSION / largerDimension,
      }),
      bytes: [0, 255],
    };
  });

  provide(HANDLING_CONFIG, handlingConfig);
  provide(DECORATE_CONFIG, decorateConfig);

  const applyConfig = () => {
    const savedState = {
      ...handlingConfig.value,
      component: activeSubpanel.value, // Still need to reapply component manually
    };
    state.value = savedState;
    isActive.value = false;
  };
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="options.remainder" />
      <DemoMiniFlag :component="activeComponent" />

      <h5 class="my-3">{{ $t('decorate.title') }}</h5>
      <p>
        <IconOption
          v-for="decorate in DECORATES"
          :id="decorate"
          :value="decorate"
          :label="'decorate.' + decorate"
          :icon="REMAINDER_ICONS[decorate]"
          v-model="activeSubpanel"
          class="mr-3"
        />
      </p>
      <p>
        <input
          id="enabled"
          type="checkbox"
          class="switch"
          v-model="complexColorsEnabled"
        />
        <label for="enabled">{{ $t('options.color.mode.title') }}</label>
      </p>

      <h5>{{ $t('decorate.options') }}</h5>
      <component :is="SUBPANELS[activeSubpanel]"></component>
      <button class="button is-success" @click="applyConfig">
        {{ $t('common.apply') }}
      </button>
    </div>
  </div>
</template>
