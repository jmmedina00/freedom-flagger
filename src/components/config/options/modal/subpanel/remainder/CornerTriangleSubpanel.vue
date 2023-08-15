<script setup>
  import { REM_TRIANGLE } from '@app/components/shared/constant/remainder';
  import { useDefaultedConfig } from '../default';
  import { BYTE_ICONS } from './byte';
  import LimitedSliderNumber from '../../../util/numeric/LimitedSliderNumber.vue';
  import IconOption from '../../../util/icon/IconOption.vue';

  const selectableAttrs = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
  const zeroedEntries = Object.fromEntries(
    selectableAttrs.map((attr) => [attr, '0'])
  );

  const config = useDefaultedConfig(REM_TRIANGLE, {
    size: 20,
    ...zeroedEntries,
  });
</script>

<template>
  <p>
    <span>{{ $t('config.remainder.size') }}</span>
    <LimitedSliderNumber :min="5" :max="50" v-model="config.size" />
  </p>
  <p v-for="attr in selectableAttrs">
    <span>{{ $t('config.remainder.' + attr) }}</span>
    <IconOption
      v-for="n in 3"
      :id="attr + '-' + n"
      :value="(n - 1).toString()"
      :label="'config.remainder.byte.' + (n - 1)"
      :icon="BYTE_ICONS[n - 1]"
      v-model="config[attr]"
    />
  </p>
</template>
