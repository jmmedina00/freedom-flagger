<script setup>
  import { computed, inject } from 'vue';
  import { NOTIFICATION } from '@app/state';

  const notification = inject(NOTIFICATION);

  const simpleString = computed(() => typeof notification.value === 'string');

  const display = computed(() =>
    simpleString.value
      ? { message: notification.value, color: 'primary' }
      : notification.value
  );

  const notificationClasses = computed(() => [
    'notification',
    'is-flex-shrink-0',
    ...display.value.color.split('-').map((value) => 'is-' + value),
  ]);

  const closeNotification = () => {
    notification.value = null;
  };
</script>

<template>
  <div class="wrapper is-flex is-justify-content-center">
    <div :class="notificationClasses" v-if="display">
      <button class="delete" @click="closeNotification"></button>
      {{ $t(display.message) }}
    </div>
  </div>
</template>

<style>
  .wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    right: 50%;
  }
</style>
