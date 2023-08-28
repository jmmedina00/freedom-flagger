<script setup>
  import { REM_MOSAIC } from '@app/components/shared/constant/remainder';
  import { useDefaultedConfig } from './common/default';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';

  const config = useDefaultedConfig(
    REM_MOSAIC,
    {
      squareRows: 25,
      rows: 2,
      offset: 1,
    },
    { proportional: [], adapted: [] }
  );
</script>

<template>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('options.squares') }}</span>
    <LimitedSliderNumber :min="10" :max="50" v-model="config.squareRows" />
  </p>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('options.rows') }}</span>
    <LimitedSliderNumber :min="1" :max="5" v-model="config.rows" />
  </p>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('options.offset') }}</span>
    <LimitedSliderNumber :min="1" :max="3" v-model="config.offset" />
  </p>
</template>
