<script setup>
  import { REM_TRIANGLE } from '@app/components/shared/constant/remainder';
  import { useDefaultedConfig } from './common/default';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';
  import ColorChoice from './common/ColorChoice.vue';
  import {
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    TOP_LEFT,
    TOP_RIGHT,
  } from '@app/components/shared/decorate/corner';
  import { useI18n } from 'vue-i18n';

  const DIRECTION_LOCALES = {
    [TOP_LEFT]: ['top', 'left'],
    [TOP_RIGHT]: ['top', 'right'],
    [BOTTOM_RIGHT]: ['bottom', 'right'],
    [BOTTOM_LEFT]: ['bottom', 'left'],
  };

  const ICONS = [
    'icons/triangle-top-left.svg',
    'icons/triangle-top-right.svg',
    'icons/triangle-bottom-right.svg',
    'icons/triangle-bottom-left.svg',
  ];

  const selectableAttrs = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
  const zeroedEntries = Object.fromEntries(
    selectableAttrs.map((attr, index) => [attr, +(index === 0)])
  );

  const { t } = useI18n();

  const getFullLocale = (locales = []) =>
    locales
      .map((locale) => t(['common', 'direction', locale].join('.')))
      .join(' ')
      .split('')
      .map((x, index) => (index === 0 ? x.toUpperCase() : x))
      .join('');

  const config = useDefaultedConfig(
    REM_TRIANGLE,
    {
      size: 20,
      ...zeroedEntries,
    },
    { adapted: selectableAttrs, proportional: ['size'] }
  );
</script>

<template>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('common.size') }}</span>
    <LimitedSliderNumber :min="5" :max="50" v-model="config.size" />
  </p>
  <ColorChoice
    v-for="(locales, direction) in DIRECTION_LOCALES"
    :title="getFullLocale(locales)"
    :icon="ICONS[direction]"
    v-model="config[selectableAttrs[direction]]"
  />
</template>
