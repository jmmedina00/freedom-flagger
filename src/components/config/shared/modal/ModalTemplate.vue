<script setup>
  import { inject } from 'vue';
  import { MODAL_ACTIVE } from '@app/state';
  const active = inject(MODAL_ACTIVE);

  const close = () => {
    active.value = false;
  };
</script>

<template>
  <div class="modal is-active" v-if="active">
    <div class="modal-background" @click="close"></div>
    <slot></slot>
  </div>
</template>
