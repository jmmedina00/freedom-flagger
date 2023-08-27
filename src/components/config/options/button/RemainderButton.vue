<script setup>
  import { CONFIG_REMAINDER } from '@app/state';
  import { useSomeConfig } from '../plugin';
  import { computed } from 'vue';
  import {
    REMAINDER_ICONS,
    REM_MOSAIC,
  } from '@app/components/shared/constant/remainder';
  import ModalCoupler from '../../shared/modal/ModalCoupler.vue';
  import RemainingBytesModal from '../modal/RemainingBytesModal.vue';
  import OptionButton from '../OptionButton.vue';

  const remainder = useSomeConfig(CONFIG_REMAINDER);
  const component = computed(() => remainder.value.component || REM_MOSAIC);
  const complexColors = computed(() => remainder.value.colorChoices >= 3);
</script>

<template>
  <ModalCoupler :component="RemainingBytesModal" v-slot="{ clicked }">
    <OptionButton
      @click="clicked"
      :icon="REMAINDER_ICONS[component]"
      :primary="$t('decorate.' + component)"
      :secondary="$t('options.color.mode.' + complexColors)"
      class="has-tooltip-arrow"
      :data-tooltip="$t('options.remainder')"
    />
  </ModalCoupler>
</template>
