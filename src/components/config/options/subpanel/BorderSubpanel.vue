<script setup>
  import { REM_BORDER } from '@app/components/shared/constant/remainder';
  import { useDefaultedConfig } from './common/default';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';
  import ColorChoice from './common/ColorChoice.vue';

  const selectableAttrs = [
    {
      attr: 'top',
      title: 'common.direction.top',
      icon: 'icons/border-top.svg',
    },
    {
      attr: 'bottom',
      title: 'common.direction.bottom',
      icon: 'icons/border-bottom.svg',
    },
    {
      attr: 'left',
      title: 'common.direction.left',
      icon: 'icons/border-left.svg',
    },
    {
      attr: 'right',
      title: 'common.direction.right',
      icon: 'icons/border-right.svg',
    },
  ];

  const zeroedEntries = Object.fromEntries(
    selectableAttrs.map(({ attr }, index) => [attr, +(index === 0)])
  );

  const config = useDefaultedConfig(
    REM_BORDER,
    {
      size: 20,
      ...zeroedEntries,
    },
    { adapted: selectableAttrs.map(({ attr }) => attr), proportional: ['size'] }
  );
</script>

<template>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('common.size') }}</span>
    <LimitedSliderNumber :min="5" :max="50" v-model="config.size" />
  </p>
  <ColorChoice
    v-for="{ attr, title, icon } in selectableAttrs"
    :title="title"
    :icon="icon"
    v-model="config[attr]"
  />
</template>
