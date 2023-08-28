<script setup>
  import { REM_HEX } from '@app/components/shared/constant/remainder';
  import { useDefaultedConfig } from './common/default';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';

  const config = useDefaultedConfig(
    REM_HEX,
    {
      size: 30,
      margin: 10,
    },
    { proportional: ['size', 'margin'], adapted: [] }
  );
</script>

<template>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('common.size') }}</span>
    <LimitedSliderNumber :min="30" :max="70" v-model="config.size" />
  </p>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('common.margin') }}</span>
    <LimitedSliderNumber :min="5" :max="100" v-model="config.margin" />
  </p>
</template>
