<script setup>
  import { ref, watch } from 'vue';
  import LimitedSliderNumber from './util/numeric/LimitedSliderNumber.vue';
  import { useSomeConfig } from './plugin';
  import { CONFIG_MAX_COLUMNS } from '@app/state';

  const defaultColumns = 12;
  const props = defineProps([]);

  const maxColumns = useSomeConfig(CONFIG_MAX_COLUMNS);
  const enabled = ref(!!maxColumns.value);

  watch(enabled, (isEnabled) => {
    maxColumns.value = isEnabled ? defaultColumns : undefined;
  });
</script>

<template>
  <div>
    <div>
      <input id="enabled" type="checkbox" class="switch" v-model="enabled" />
      <label for="enabled">{{ $t('config.limitColumns') }}</label>
    </div>
    <div v-if="enabled">
      <small class="is-block">
        {{ $t('config.maxColumns') + ':' }}
      </small>
      <LimitedSliderNumber v-model="maxColumns" :min="1" :max="32" />
    </div>
  </div>
</template>
