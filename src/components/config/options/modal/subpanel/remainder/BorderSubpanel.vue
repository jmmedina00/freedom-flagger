<script setup>
  import { REM_BORDER } from '@app/components/shared/constant/remainder';
  import { useDefaultedConfig } from '../default';
  import LimitedSliderNumber from '../../../util/numeric/LimitedSliderNumber.vue';
  import ColorChoice from './common/ColorChoice.vue';

  const selectableAttrs = ['top', 'bottom', 'left', 'right'];
  const zeroedEntries = Object.fromEntries(
    selectableAttrs.map((attr, index) => [attr, +(index === 0)])
  );

  const config = useDefaultedConfig(
    REM_BORDER,
    {
      size: 20,
      ...zeroedEntries,
    },
    { adapted: selectableAttrs, proportional: ['size'] }
  );
</script>

<template>
  <p>
    <span>{{ $t('config.remainder.size') }}</span>
    <LimitedSliderNumber :min="5" :max="50" v-model="config.size" />
  </p>
  <ColorChoice
    v-for="attr in selectableAttrs"
    :title="attr"
    v-model="config[attr]"
  />
</template>
