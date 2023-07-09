<script setup>
  import { computed, inject, ref } from 'vue';
  import { NUMBER_BYTES } from '@app/state';
  import NumberEditor from './NumberEditor.vue';
  import IconButton from '../../shared/IconButton.vue';

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
    <IconButton class="is-align-self-center" icon="add" @click="addNumber" />
  </div>
</template>
