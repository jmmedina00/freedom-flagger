<script setup>
  import { computed, inject, ref } from 'vue';
  import NumberDisplay from '../read/NumberDisplay.vue';
  import { MODAL_ACTIVE, NUMBER_BYTES } from '@app/state';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';

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
      <ModalTitle name="actions.provide.text.title" />
      <textarea class="textarea is-primary" v-model="text"></textarea>

      <h5 class="my-2" v-if="number.length > 0">
        {{ $t('actions.provide.preview') }}
      </h5>
      <NumberDisplay class="preview" :number="getNumber()" />
      <button
        class="button is-success"
        @click="applyNumber"
        :disabled="!isValid"
      >
        {{ $t('common.apply') }}
      </button>
    </div>
  </div>
</template>
