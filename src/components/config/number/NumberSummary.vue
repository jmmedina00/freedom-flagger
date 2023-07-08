<script setup>
  import { computed, inject, ref } from 'vue';
  import { NUMBER_BYTES } from '@app/state';
  import NumberEditor from './NumberEditor.vue';
  import DiscreteIcon from '../../shared/DiscreteIcon.vue';

  const number = inject(NUMBER_BYTES, ref([0]));

  const positions = computed(() => number.value.map((_, index) => index));

  const addNumber = () => {
    number.value = [...number.value, 0];
  };

  const deleteNumber = (position = 0) => {
    number.value = number.value.filter((_, index) => index !== position);
  };
</script>

<template>
  <NumberEditor
    v-for="index in positions"
    :position="index"
    @delete="deleteNumber(index)"
  />
  <DiscreteIcon class="clickable" icon="add" @click="addNumber" />
</template>
