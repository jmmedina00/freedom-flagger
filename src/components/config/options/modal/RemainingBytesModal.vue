<script setup>
  import DemoMiniFlag from '../util/DemoMiniFlag.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';
  import { computed, inject, provide, ref } from 'vue';
  import {
    CONFIG_REMAINDER,
    DECORATE_CONFIG,
    HANDLING_CONFIG,
    MODAL_ACTIVE,
  } from '@app/state';
  import IconOption from '../util/icon/IconOption.vue';
  import MosaicSubpanel from './subpanel/remainder/MosaicSubpanel.vue';
  import CornerTriangleSubpanel from './subpanel/remainder/CornerTriangleSubpanel.vue';
  import BorderSubpanel from './subpanel/remainder/BorderSubpanel.vue';
  import { placeColorsOnIndexes } from '@app/components/shared/color-index';
  import {
    REMAINDER_COMPONENTS,
    REMAINDER_ICONS,
    REM_BORDER,
    REM_MOSAIC,
    REM_TRIANGLE,
  } from '@app/components/shared/constant/remainder';
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { useSomeConfig } from '../plugin';

  const SUBPANELS = {
    [REM_MOSAIC]: MosaicSubpanel,
    [REM_TRIANGLE]: CornerTriangleSubpanel,
    [REM_BORDER]: BorderSubpanel,
  };
  const MAX_SCALED_DIMENSION = 200;
  const SAMPLE_COLORS = ['#fff', '#aaa', '#777'];
  const DECORATES = Object.keys(SUBPANELS);

  const state = useSomeConfig(CONFIG_REMAINDER, {
    component: REM_MOSAIC,
    config: {},
    colorChoices: 2,
  });
  const isActive = inject(MODAL_ACTIVE, ref(true));
  const sizing = useFullStateSize();
  const handlingConfig = ref(state.value.config || {});

  const activeSubpanel = ref(state.value.component);
  const activeComponent = computed(
    () => REMAINDER_COMPONENTS[activeSubpanel.value]
  );

  const decorateConfig = computed(() => {
    const { config, proportional, adapted } = handlingConfig.value;
    if (!config) return {};

    const { width, height } = sizing.value;
    const largerDimension = Math.max(width, height);

    const fieldsToScale = [...proportional];
    const adaptedConfig =
      adapted.length > 0
        ? placeColorsOnIndexes(config, {
            colors: SAMPLE_COLORS,
            fields: adapted,
          })
        : { ...config, colors: SAMPLE_COLORS };

    const scaledEntries = Object.entries(adaptedConfig).map(([key, value]) => {
      if (!fieldsToScale.includes(key)) return [key, value];

      const parsedValue = parseInt(value) || 0;
      const scaledValue =
        (MAX_SCALED_DIMENSION * parsedValue) / largerDimension;

      return [key, scaledValue];
    });

    return Object.fromEntries([...scaledEntries]);
  });

  provide(HANDLING_CONFIG, handlingConfig);
  provide(DECORATE_CONFIG, decorateConfig);

  const applyConfig = () => {
    const savedState = {
      component: activeSubpanel.value,
      config: { ...handlingConfig.value },
    };
    state.value = savedState;
    isActive.value = false;
  };
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="config.remainder" />
      <DemoMiniFlag :component="activeComponent" />

      <h5>{{ $t('config.decorate') }}</h5>
      <p>
        <IconOption
          v-for="decorate in DECORATES"
          :id="decorate"
          :value="decorate"
          :label="'config.decorate.' + decorate"
          :icon="REMAINDER_ICONS[decorate]"
          v-model="activeSubpanel"
        />
      </p>

      <h5>{{ $t('config.decorate.options') }}</h5>
      <component :is="SUBPANELS[activeSubpanel]"></component>
      <button class="button is-success" @click="applyConfig">
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>
