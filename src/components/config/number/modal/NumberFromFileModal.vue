<script setup>
  import { computed, inject, ref } from 'vue';
  import NumberDisplay from '../read/NumberDisplay.vue';
  import { MODAL_ACTIVE, NUMBER_BYTES } from '@app/state';
  import DiscreteIcon from '@app/components/shared/DiscreteIcon.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';

  const isActive = inject(MODAL_ACTIVE, ref(true));
  const stateNumber = inject(NUMBER_BYTES, ref([0]));

  const contentBytes = ref([]);
  const getContent = () => contentBytes;

  const isValid = computed(() => contentBytes.value.length > 0);

  const displayError = ref(false);

  const updateContents = async (event) => {
    const [file] = event.target.files;

    if (file.size > 1024) {
      contentBytes.value = [];
      displayError.value = true;
      return;
    }

    const buffer = await file.arrayBuffer();
    contentBytes.value = [...new Uint8Array(buffer)];
    displayError.value = false;
  };

  const applyNumber = () => {
    stateNumber.value = [...contentBytes.value];
    isActive.value = false;
  };
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="actions.provide.file.title" />
      <div class="file is-boxed is-justify-content-center">
        <label
          class="file-label"
          :aria-label="$t('actions.provide.file.title')"
        >
          <input class="file-input" type="file" @change="updateContents" />
          <span class="file-cta">
            <DiscreteIcon icon="file_upload" />
            <span class="file-label">
              {{ $t('actions.provide.file.isValid.' + isValid) }}
            </span>
          </span>
        </label>
      </div>

      <h5 class="my-2" v-if="contentBytes.length > 0">
        {{ $t('actions.provide.preview') }}
      </h5>
      <NumberDisplay class="preview" :number="getContent()" />
      <p class="has-text-danger has-text-centered" v-if="displayError">
        {{ $t('actions.provide.file.tooLarge') }}
      </p>
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
