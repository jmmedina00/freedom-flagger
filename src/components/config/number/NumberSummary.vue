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
  <div class="is-flex is-flex-wrap-wrap">
    <NumberEditor
      v-for="index in positions"
      :position="index"
      @delete="deleteNumber(index)"
    />
    <DiscreteIcon
      class="clickable is-align-self-center"
      icon="add"
      @click="addNumber"
    />
  </div>
</template>

<style scoped>
  input {
    margin: 0.2em;
  }
  .clickable {
    margin-left: 0.2em;
  }
</style>
