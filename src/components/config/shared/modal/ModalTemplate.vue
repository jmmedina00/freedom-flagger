<script setup>
  import { inject, nextTick, ref, watch } from 'vue';
  import { MODAL_ACTIVE } from '@app/state';
  import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';

  const div = ref(null);

  const active = inject(MODAL_ACTIVE);
  const { activate, deactivate } = useFocusTrap(div);

  const close = () => {
    active.value = false;
  };

  watch(active, async (current) => {
    if (current) {
      await nextTick();
      activate();
    } else {
      deactivate();
    }
  });
</script>

<template>
  <div class="modal is-active" v-if="active" ref="div">
    <div class="modal-background" @click="close"></div>
    <slot></slot>
  </div>
</template>
