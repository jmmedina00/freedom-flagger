<script setup>
  import { ref } from 'vue';
  import { RENDERER_DIVIDED } from '@app/components/shared/constant/rendering';
  import { useDefaultedConfig } from './common/default';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';

  const config = useDefaultedConfig(RENDERER_DIVIDED, { mainFlagPercent: 50 });
</script>

<template>
  <p>
    <span>{{ $t('options.percent') }} (%)</span>
    <LimitedSliderNumber :min="1" :max="100" v-model="config.mainFlagPercent" />
  </p>
</template>
