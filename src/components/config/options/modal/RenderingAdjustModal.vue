<script setup>
  import {
    CONFIG_RENDERING,
    DECORATE_CONFIG,
    HANDLING_CONFIG,
    MODAL_ACTIVE,
  } from '@app/state';
  import { useSomeConfig } from '../plugin';
  import { computed, inject, provide, ref } from 'vue';
  import {
    DECORATE_COMPONENTS,
    RENDERER_DECORATE,
    RENDERER_DIVIDED,
    RENDERER_STANDARD,
  } from '@app/components/shared/constant/rendering';
  import IconOption from '../util/icon/IconOption.vue';
  import DivideLineSubpanel from '../subpanel/DivideLineSubpanel.vue';
  import DecorateSubpanel from '../subpanel/DecorateSubpanel.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';
  import DemoFlat from '../util/demo/DemoFlat.vue';
  import DemoSplit from '../util/demo/DemoSplit.vue';
  import DemoMiniFlag from '../util/demo/DemoMiniFlag.vue';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';
  import { placeColorsOnIndexes } from '@app/components/shared/color-index';
  import { useFullStateSize } from '@app/components/render/helper/size';

  const MAX_SCALED_DIMENSION = 200;
  const SAMPLE_COLORS = [
    '#99b433',
    '#00a300',
    '#1e7145',
    '#ff0097',
    '#9f00a7',
    '#7e3878',
    '#603cba',
    '#1d1d1d',
    '#00aba9',
    '#2d89ef',
  ];

  const renderers = [
    {
      value: RENDERER_STANDARD,
      icon: 'work',
      panel: null,
      demo: DemoFlat,
      params: () => ({}),
    },
    {
      value: RENDERER_DIVIDED,
      icon: 'pets',
      panel: DivideLineSubpanel,
      demo: DemoSplit,
      params: ({ mainFlagPercent }) => ({ percent: mainFlagPercent }),
    },
    {
      value: RENDERER_DECORATE,
      icon: 'explore',
      panel: DecorateSubpanel,
      demo: DemoMiniFlag,
      params: ({ decorate }) => ({ component: DECORATE_COMPONENTS[decorate] }),
    },
  ];

  const isActive = inject(MODAL_ACTIVE, ref(true));
  const renderingConfig = useSomeConfig(CONFIG_RENDERING, {
    columnsLimited: false,
    columnsMax: 6,
    renderer: RENDERER_STANDARD,
    params: {},
  });
  const sizing = useFullStateSize();

  const selectedRenderer = ref(
    renderingConfig.value.renderer || RENDERER_STANDARD
  );

  const currentInfo = computed(
    () =>
      renderers.find(({ value }) => value === selectedRenderer.value) ||
      renderers[0]
  );
  const current = computed(() => {
    const { panel, demo } = currentInfo.value;
    return { panel, demo };
  });

  const handlingConfig = ref({
    component: selectedRenderer.value,
    config: { ...renderingConfig.value.params } || {},
  });

  const demoColorAmount = ref(2);
  const demoParams = computed(() => {
    const { config } = handlingConfig.value;
    const { params: fn } = currentInfo.value;

    return fn(config);
  });
  const demoDecorateConfig = computed(() => {
    const workingConfig = handlingConfig.value?.config?.decorateConfig || {};
    const scaled = handlingConfig.value?.config?.scale || [];
    const colors = SAMPLE_COLORS.slice(0, demoColorAmount.value);

    const { width, height } = sizing.value;
    const scaleRatio = MAX_SCALED_DIMENSION / Math.max(width, height);

    return placeColorsOnIndexes(workingConfig, {
      scaled,
      scaleRatio,
      colors,
      fields: [],
    });
  });

  provide(HANDLING_CONFIG, handlingConfig);
  provide(DECORATE_CONFIG, demoDecorateConfig);

  const applyConfig = () => {
    const { scale, ...params } = { ...handlingConfig.value.config };

    const savedState = {
      ...renderingConfig.value,
      renderer: selectedRenderer.value,
      params,
    };

    renderingConfig.value = savedState;
    isActive.value = false;
  };
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="renderer.title" />

      <component v-if="current.demo" :is="current.demo" v-bind="demoParams" />
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
      <p v-if="selectedRenderer === RENDERER_DECORATE">
        <span>{{ $t('options.color.demo') }}</span>
        <LimitedSliderNumber :min="1" :max="10" v-model="demoColorAmount" />
      </p>
      <component v-if="current.panel" :is="current.panel" />
      <button class="button is-success" @click="applyConfig">
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>
