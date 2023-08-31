<script setup>
  import { DECORATE_INFINITE } from '@app/components/shared/constant/rendering';
  import {
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    TOP_LEFT,
    TOP_RIGHT,
  } from '@app/components/shared/decorate/corner';
  import { useDefaultedConfig } from './common/default';
  import { useI18n } from 'vue-i18n';
  import IconOption from '../util/icon/IconOption.vue';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';

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

  const { t } = useI18n();

  const getFullLocale = (locales = []) =>
    locales
      .map((locale) => t(['common', 'direction', locale].join('.')))
      .join(' ')
      .split('')
      .map((x, index) => (index === 0 ? x.toUpperCase() : x))
      .join('');

  const config = useDefaultedConfig(
    DECORATE_INFINITE,
    {
      size: 10,
      corner: TOP_LEFT,
    },
    { proportional: [], adapted: [] }
  );
</script>

<template>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('common.size') }}</span>
    <LimitedSliderNumber :min="1" :max="50" v-model="config.size" />
  </p>
  <h6>{{ $t('options.corner') }}</h6>
  <p class="flexi-paragraph">
    <IconOption
      v-for="(locales, direction) in DIRECTION_LOCALES"
      :id="direction"
      :value="direction"
      :label="getFullLocale(locales)"
      :icon="ICONS[direction]"
      v-model="config.corner"
      class="mr-3"
    />
    <span class="is-align-self-center has-text-weight-bold">
      {{ getFullLocale(DIRECTION_LOCALES[config.corner]) }}
    </span>
  </p>
</template>
