<script setup>
  import {
    DECORATE_COMPONENTS,
    DECORATE_INFINITE,
    DECORATE_MOSAIC,
    DECORATE_SHAPE,
    RENDERER_DECORATE,
  } from '@app/components/shared/constant/rendering';
  import { HANDLING_CONFIG } from '@app/state';
  import { useDefaultedConfig } from './common/default';
  import { provide, ref, watch } from 'vue';
  import MosaicSubpanel from './MosaicSubpanel.vue';
  import InfiniteSubpanel from './InfiniteSubpanel.vue';
  import ShapeSubpanel from './ShapeSubpanel.vue';
  import IconOption from '../util/icon/IconOption.vue';

  const REMAINDER_ICONS = {
    [DECORATE_MOSAIC]: 'auto_awesome_mosaic',
    [DECORATE_INFINITE]: 'repeat_on',
    [DECORATE_SHAPE]: 'interests',
  };

  const SUBPANELS = {
    [DECORATE_MOSAIC]: MosaicSubpanel,
    [DECORATE_INFINITE]: InfiniteSubpanel,
    [DECORATE_SHAPE]: ShapeSubpanel,
  };

  const DECORATES = Object.keys(DECORATE_COMPONENTS);

  const state = useDefaultedConfig(RENDERER_DECORATE, {
    decorate: DECORATE_MOSAIC,
    decorateConfig: { squareRows: 25, rows: 2, offset: 1 },
  });

  const handlingConfig = ref({
    component: state.value.decorate,
    config: { ...state.value.decorateConfig },
  });
  const activeSubpanel = ref(handlingConfig.value.component);
  provide(HANDLING_CONFIG, handlingConfig);

  watch(activeSubpanel, (subpanel) => {
    state.value = { ...state.value, decorate: subpanel };
  });

  watch(
    handlingConfig,
    ({ config }) => {
      state.value = { ...state.value, decorateConfig: { ...config } };
    },
    { deep: true }
  );
</script>

<template>
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
  <component v-if="activeSubpanel" :is="SUBPANELS[activeSubpanel]"></component>
</template>
