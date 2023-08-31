<script setup>
  import IconOption from '../../util/icon/IconOption.vue';
  import { BYTE_ICONS } from './byte';
  import { computed, inject, ref, watch } from 'vue';
  import { HANDLING_CONFIG } from '@app/state';
  import DiscreteIcon from '@app/components/shared/DiscreteIcon.vue';

  const props = defineProps(['icon', 'title', 'modelValue']);
  const emit = defineEmits(['update:modelValue']);

  const handling = inject(HANDLING_CONFIG);
  const choices = computed(() => (handling.value.colorChoices || 2) + 1);

  const currentValue = ref(props.modelValue);

  const model = computed({
    get: () => currentValue.value.toString(),
    set: (value) => {
      const parsed = parseInt(value);

      emit('update:modelValue', parsed);
      currentValue.value = parsed;
    },
  });

  watch([choices, model], ([availableTotal, current]) => {
    if (parseInt(current) === availableTotal) model.value = 0;
  });
</script>
<template>
  <p class="is-flex is-flex-wrap-wrap is-align-items-center">
    <DiscreteIcon class="mr-3" :icon="icon" :data-tooltip="title" :size="48" />
    <IconOption
      v-for="n in choices"
      :id="title + '-' + n"
      :value="(n - 1).toString()"
      :label="'options.byte.' + (n - 1)"
      :icon="BYTE_ICONS[n - 1] || ''"
      v-model="model"
      class="mr-2"
    />
  </p>
</template>

<style scoped>
  .not-quite-aligned {
    line-height: 4.5;
  }
</style>
