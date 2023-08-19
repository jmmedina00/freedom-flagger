<script setup>
  import { computed, provide } from 'vue';
  import { useFullStateSize } from '../helper/size';
  import { CONFIG_REMAINDER, DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import {
    REMAINDER_COMPONENTS,
    REM_MOSAIC,
  } from '@app/components/shared/constant/remainder';
  import { placeColorsOnIndexes } from '@app/components/shared/color-index';
  import { useSomeConfig } from '@app/components/config/options/plugin';

  const props = defineProps(['bytes']);

  const colorGenerators = {
    2: (bytes = [0]) => {
      const usedBytes = bytes.length === 2 ? bytes : [bytes[0], bytes[0]];
      return usedBytes.map((byte) => '#' + byte.toString(16).repeat(3));
    },
    3: (bytes = [0]) => {
      const shuffleVersions = (permanent = [1, 2], shuffled = 3) => {
        return new Array(permanent.length + 1).fill('0').map((_, index) => {
          const instance = [...permanent];
          instance.splice(index, 0, shuffled);

          return (
            '#' + instance.map((x) => x.toString(16).padStart(2, 0)).join('')
          );
        });
      };

      return bytes.length === 1
        ? shuffleVersions([0, 0], bytes[0])
        : shuffleVersions(bytes, 0).reverse();
    },
  };

  const sizing = useFullStateSize();
  provide(DECORATE_SIZE, sizing);

  const remainder = useSomeConfig(CONFIG_REMAINDER);

  const selectedComponent = computed(
    () => REMAINDER_COMPONENTS[remainder.value.component]
  );

  const adaptedConfig = computed(() => {
    const { config, adapted, colorChoices } = {
      component: REM_MOSAIC,
      config: {},
      proportional: [],
      adapted: [],
      colorChoices: 3,
      ...remainder.value,
    };

    return placeColorsOnIndexes(config, {
      fields: adapted,
      colors: colorGenerators[colorChoices](props.bytes),
    });
  });

  provide(DECORATE_CONFIG, adaptedConfig);
</script>

<template>
  <component :is="selectedComponent" />
</template>
