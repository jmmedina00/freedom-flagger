<script setup>
  import { CONFIG_RENDERING, HANDLING_CONFIG, MODAL_ACTIVE } from '@app/state';
  import { useSomeConfig } from '../plugin';
  import { computed, inject, provide, ref } from 'vue';
  import {
    RENDERER_DECORATE,
    RENDERER_DIVIDED,
    RENDERER_STANDARD,
  } from '@app/components/shared/constant/rendering';
  import IconOption from '../util/icon/IconOption.vue';
  import DivideLineSubpanel from '../subpanel/DivideLineSubpanel.vue';
  import DecorateSubpanel from '../subpanel/DecorateSubpanel.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';

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

  const isActive = inject(MODAL_ACTIVE, ref(true));
  const renderingConfig = useSomeConfig(CONFIG_RENDERING, {
    columnsLimited: false,
    columnsMax: 6,
    renderer: RENDERER_STANDARD,
    params: {},
  });

  const selectedRenderer = ref(
    renderingConfig.value.renderer || RENDERER_STANDARD
  );
  const currentPanel = computed(() => panels[selectedRenderer.value]);

  const handlingConfig = ref({
    component: selectedRenderer.value,
    config: { ...renderingConfig.value.params } || {},
  });

  provide(HANDLING_CONFIG, handlingConfig);

  const applyConfig = () => {
    const savedState = {
      ...renderingConfig.value,
      renderer: selectedRenderer.value,
      params: { ...handlingConfig.value.config },
    };

    renderingConfig.value = savedState;
    isActive.value = false;
  };
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="renderer.title" />
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
      <p>
        {{ handlingConfig }}
        {{ selectedRenderer }}
      </p>
      <button class="button is-success" @click="applyConfig">
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>
