<script setup>
  import { CONFIG_SIZING } from '@app/state';
  import { useSomeConfig } from '../plugin';
  import { useCalculatedSizes } from '../../../shared/sizing';
  import ModalCoupler from '../../shared/modal/ModalCoupler.vue';
  import SizingAdjustModal from '../modal/SizingAdjustModal.vue';
  import OptionButton from '../OptionButton.vue';
  import { computed } from 'vue';

  const sizing = useSomeConfig(CONFIG_SIZING);
  const fullDimensions = useCalculatedSizes(sizing);

  const ratioDefined = computed(() => !!sizing.value.aspectRatio);

  const aspectRatio = computed(() => {
    if (!ratioDefined.value) return 'custom';

    return sizing.value.aspectRatio.x + ':' + sizing.value.aspectRatio.y;
  });

  const orientation = computed(() =>
    !!ratioDefined.value &&
    sizing.value.aspectRatio.x < sizing.value.aspectRatio.y
      ? 'crop_portrait'
      : 'crop_landscape'
  );

  const widthClasses = computed(() =>
    !sizing.value.width ? ['inferred'] : []
  );

  const heightClasses = computed(() =>
    !sizing.value.height ? ['inferred'] : []
  );
</script>

<template>
  <ModalCoupler :component="SizingAdjustModal" v-slot="{ clicked, ...other }">
    <OptionButton
      @click="clicked"
      :icon="orientation"
      :secondary="$t(aspectRatio)"
      :data-tooltip="$t('options.sizing')"
      :aria-label="$t('options.sizing')"
      class="has-tooltip-arrow has-tooltip-bottom"
      v-bind="other"
    >
      <template v-slot:primary>
        <span :class="widthClasses">{{ fullDimensions.width }}</span>
        <span class="separator">x</span>
        <span :class="heightClasses">{{ fullDimensions.height }}</span>
      </template>
    </OptionButton>
  </ModalCoupler>
</template>

<style scoped>
  .inferred {
    font-style: italic;
  }
  .separator {
    margin: 0 0.25em;
  }
</style>
