<script setup>
  import { computed, inject, provide, ref, watch } from 'vue';
  import { NUMBER_BYTES } from '@app/state';
  import NumberEditor from './NumberEditor.vue';
  import IconButton from '../../../shared/IconButton.vue';
  import { CURRENT_POSITION } from '../state';
  import TabPicker from '../common/TabPicker.vue';

  const bases = [
    [16, 'number.hex'],
    [2, 'number.bin'],
    [10, 'number.dec'],
  ];

  const number = inject(NUMBER_BYTES, ref([0]));
  const currentPosition = ref(-1);
  provide(CURRENT_POSITION, currentPosition);

  const positions = computed(() => number.value.map((_, index) => index));
  const key = ref(0);
  const base = ref(16);

  const addNumber = () => {
    number.value = [...number.value, 0];
  };

  const deleteNumber = (position = 0) => {
    number.value = number.value.filter((_, index) => index !== position);

    const oldPosition = currentPosition.value;
    currentPosition.value = Math.min(oldPosition, number.value.length - 1);
    key.value += 1;
  };

  watch(currentPosition, (newValue, oldValue) => {
    if (newValue < oldValue || newValue !== number.value.length) return;
    addNumber();
  });
</script>

<template>
  <TabPicker :values="bases" v-model="base" />
  <div class="is-flex is-flex-wrap-wrap" :key="key + '-' + base">
    <NumberEditor
      v-for="index in positions"
      :position="index"
      :base="base"
      @delete="deleteNumber(index)"
      class="mr-1"
    />
    <IconButton class="is-align-self-center" icon="add" @click="addNumber" />
  </div>
</template>
