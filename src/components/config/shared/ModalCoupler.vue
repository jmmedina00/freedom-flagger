<script setup>
  import { provide, ref } from 'vue';
  import ModalTemplate from './ModalTemplate.vue';
  import { MODAL_ACTIVE } from '../../../state';

  const props = defineProps(['enabled', 'label']);
  const enabled = ref(props.enabled ?? true);
  const active = ref(false);

  provide(MODAL_ACTIVE, active);

  const launchModal = () => {
    active.value = enabled.value;
  };
</script>

<template>
  <slot name="button" :clicked="launchModal">
    <button class="button" @click="launchModal">
      {{ $t(label || 'missingModal') }}
    </button>
  </slot>

  <slot>
    <ModalTemplate>
      <div class="modal-content">
        <div class="box">
          {{ $t(label || 'missingModal') }}
        </div>
      </div>
    </ModalTemplate>
  </slot>
</template>
