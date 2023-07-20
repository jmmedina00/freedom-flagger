<script setup>
  import { computed, inject, ref } from 'vue';
  import NumberDisplay from '../read/NumberDisplay.vue';
  import { MODAL_ACTIVE, NUMBER_BYTES } from '@app/state';

  const splitIntoBytes = (numeric) => {
    if (numeric === 0) return [];
    const finalByte = numeric & 0xff;
    return [splitIntoBytes(numeric >> 8), finalByte].flat();
  };

  const text = ref('');
  const number = computed(() =>
    text.value.split('').flatMap((x) => splitIntoBytes(x.codePointAt()))
  );
  const getNumber = () => number;
  const isValid = computed(() => number.value.length > 0);

  const isActive = inject(MODAL_ACTIVE, ref(true));
  const stateNumber = inject(NUMBER_BYTES, ref([0]));

  const applyNumber = () => {
    stateNumber.value = [...number.value];
    isActive.value = false;
  };
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <textarea class="textarea" v-model="text"></textarea>
      <NumberDisplay class="preview" :number="getNumber()" />
      <button
        class="button is-success"
        @click="applyNumber"
        :disabled="!isValid"
      >
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>
