<script setup>
  import { MODAL_ACTIVE } from '@app/state';
  import { inject } from 'vue';
  import PanelBar from '../PanelBar.vue';
  import IconButton from '@app/components/shared/IconButton.vue';

  const props = defineProps(['name']);
  const active = inject(MODAL_ACTIVE);

  const closeModal = () => {
    active.value = false;
  };
</script>
<template>
  <PanelBar :name="name">
    <IconButton icon="close" @click="closeModal" />
  </PanelBar>
</template>
