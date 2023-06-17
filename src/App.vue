<script setup>
  import { provide, ref, watch } from 'vue';
  import ConfigPanel from './components/config/ConfigPanel.vue';
  import RenderPanel from './components/render/RenderPanel.vue';
  import { useFullscreen, useScreenOrientation } from '@vueuse/core';
  import { FULL_FLAG_DISPLAY } from './state';

  const fullFlagDisplay = ref(false);
  provide(FULL_FLAG_DISPLAY, fullFlagDisplay);

  const { isSupported, lockOrientation, unlockOrientation } =
    useScreenOrientation();
  const { isFullscreen, enter, exit } = useFullscreen();

  watch(isFullscreen, (status) => {
    fullFlagDisplay.value = !!status;
  });

  watch(fullFlagDisplay, async (status) => {
    console.log(status);

    if (!!status && !!isSupported.value) {
      await Promise.any(enter(), lockOrientation('landscape')); // lock orientation doesn't work on desktop
    } else {
      await Promise.all(exit(), unlockOrientation());
    }
  });
</script>

<template>
  <div class="is-flex" :class="{ 'full-display': fullFlagDisplay }">
    <RenderPanel class="is-hidden-mobile fullscreen-show" />
    <ConfigPanel class="fullscreen-hide" />
  </div>
</template>

<style scoped>
  div {
    height: 100%;
  }

  .full-display .fullscreen-show {
    display: inherit !important;
  }

  .full-display .fullscreen-hide {
    display: none !important; /* Bulma already drills display modes, so... */
  }
</style>
