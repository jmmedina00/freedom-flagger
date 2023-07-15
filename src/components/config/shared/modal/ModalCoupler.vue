<script setup>
  import { provide, ref } from 'vue';
  import ModalTemplate from './ModalTemplate.vue';
  import { MODAL_ACTIVE } from '@app/state';

  const props = defineProps(['enabled', 'label', 'component']);
  const enabled = ref(props.enabled ?? true);
  const active = ref(false);

  provide(MODAL_ACTIVE, active);

  const launchModal = () => {
    active.value = enabled.value;
  };
</script>

<template>
  <slot :clicked="launchModal">
    <button class="button" @click="launchModal">
      {{ $t(label || 'missingModal') }}
    </button>
  </slot>

  <ModalTemplate>
    <component v-if="component" :is="component" />
    <slot name="content" v-else>
      <div class="modal-content">
        <div class="box">
          {{ $t(label || 'missingModal') }}
        </div>
      </div>
    </slot>
  </ModalTemplate>
</template>
