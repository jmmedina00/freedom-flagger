<script setup>
  import MosaicDecorate from '@app/components/shared/decorate/MosaicDecorate.vue';
  import DemoMiniFlag from '../util/DemoMiniFlag.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';
  import { computed, provide, ref } from 'vue';
  import { DECORATE_CONFIG, HANDLING_CONFIG } from '@app/state';
  import IconOption from '../util/icon/IconOption.vue';
  import BorderDecorate from '@app/components/shared/decorate/BorderDecorate.vue';
  import CornerTriangleDecorate from '@app/components/shared/decorate/CornerTriangleDecorate.vue';
  import MosaicSubpanel from './subpanel/remainder/MosaicSubpanel.vue';
  import CornerTriangleSubpanel from './subpanel/remainder/CornerTriangleSubpanel.vue';
  import BorderSubpanel from './subpanel/remainder/BorderSubpanel.vue';

  const props = defineProps(['foo']);
  const SUBPANELS = {
    mosaic: MosaicSubpanel,
    triangle: CornerTriangleSubpanel,
    border: BorderSubpanel,
  };

  const ADAPTERS = {
    mosaic: MosaicDecorate,
    triangle: CornerTriangleDecorate,
    border: BorderDecorate,
  };

  const ICONS = {
    mosaic: 'auto_awesome_mosaic',
    triangle: 'rounded_corner',
    border: 'border_style',
  };

  const DECORATES = Object.keys(SUBPANELS);
  const handlingConfig = ref({}); // TODO - initialize from current state

  const activeSubpanel = ref('mosaic'); // TODO - initialize from current state
  const activeAdapter = computed(() => ADAPTERS[activeSubpanel.value]);

  const decorateConfig = computed(() => handlingConfig.value.config || {});
  const proportional = computed(() => handlingConfig.value.proportional || []);

  provide(HANDLING_CONFIG, handlingConfig);
  provide(DECORATE_CONFIG, decorateConfig);
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="config.remainder" />
      <DemoMiniFlag :component="activeAdapter" />

      <h5>{{ $t('config.decorate') }}</h5>
      <p>
        <IconOption
          v-for="decorate in DECORATES"
          :id="decorate"
          :value="decorate"
          :label="'config.decorate.' + decorate"
          :icon="ICONS[decorate]"
          v-model="activeSubpanel"
        />
      </p>

      <h5>{{ $t('config.decorate.options') }}</h5>
      <component :is="SUBPANELS[activeSubpanel]"></component>
      <p>{{ activeSubpanel }}</p>

      <p>{{ proportional }}</p>
    </div>
  </div>
</template>
