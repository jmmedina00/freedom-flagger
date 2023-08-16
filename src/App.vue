<script setup>
  import { provide, ref, watch } from 'vue';
  import ConfigPanel from './components/config/ConfigPanel.vue';
  import RenderPanel from './components/render/RenderPanel.vue';
  import { useFullscreen, useScreenOrientation } from '@vueuse/core';
  import { CONFIG_SIZING, FULL_FLAG_DISPLAY } from './state';
  import NotificationBlock from './components/notification/NotificationBlock.vue';
  import { useSomeConfig } from './components/config/options/plugin';

  const fullFlagDisplay = ref(false);
  provide(FULL_FLAG_DISPLAY, fullFlagDisplay);

  // Provide default for first-time boot
  useSomeConfig(CONFIG_SIZING, { width: 300, aspectRatio: { x: 3, y: 2 } });

  const { isSupported, lockOrientation, unlockOrientation } =
    useScreenOrientation();
  const { isFullscreen, enter, exit } = useFullscreen();

  watch(isFullscreen, (status) => {
    fullFlagDisplay.value = !!status;
  });

  watch(fullFlagDisplay, async (status) => {
    console.log(status);

    if (!!status && !!isSupported.value) {
      await Promise.any([enter(), lockOrientation('landscape')]); // lock orientation doesn't work on desktop
    } else {
      await Promise.all([exit(), unlockOrientation()]);
    }
  });
</script>

<template>
  <div class="is-flex main" :class="{ 'full-display': fullFlagDisplay }">
    <RenderPanel class="is-hidden-mobile fullscreen-show" />
    <ConfigPanel class="fullscreen-hide" />
  </div>
  <NotificationBlock />
</template>

<style scoped>
  .main {
    height: 100%;
  }

  .full-display .fullscreen-show {
    display: inherit !important;
  }

  .full-display .fullscreen-hide {
    display: none !important; /* Bulma already drills display modes, so... */
  }
</style>
