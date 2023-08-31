<script setup>
  import { computed, inject, watch } from 'vue';
  import { FULL_FLAG_DISPLAY, NOTIFICATION } from '@app/state';
  import PanelBar from '../shared/PanelBar.vue';
  import IconButton from '../../shared/IconButton.vue';
  import SizingButton from './button/SizingButton.vue';
  import { useExportToClipboard } from './export/clipboard';
  import { useDownloadFlag } from './export/download';
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { useI18n } from 'vue-i18n';
  import RenderingOptions from './RenderingOptions.vue';
  import RemainderButton from './button/RemainderButton.vue';
  import { useDark, useStorage } from '@vueuse/core';
  import About from './button/About.vue';
  import { useDarkAlternate } from '@app/util/dark';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);
  const notification = inject(NOTIFICATION);
  const sizing = useFullStateSize();

  const isDark = useDark();
  const darkChangeText = computed(() => (isDark.value ? 'light' : 'dark'));

  const { t, locale, availableLocales } = useI18n();
  const lang = useStorage('lang');

  const panelColor = useDarkAlternate('primary');

  const enterFlagDisplay = () => {
    fullFlagDisplay.value = true;
  };

  watch(locale, (value) => {
    notification.value = {
      message: 'actions.language.current',
      color: 'info',
    };
    lang.value = value;
  });

  const cycleLanguage = () => {
    const currentIndex = availableLocales.indexOf(locale.value);
    const newLocale = availableLocales.at(
      (currentIndex + 1) % availableLocales.length
    );

    locale.value = newLocale;
  };

  const copyToClipboard = async () => {
    try {
      await useExportToClipboard(document, sizing.value);
      notification.value = {
        message: 'actions.copy.success',
        color: 'success',
      };
    } catch (e) {
      console.error(e);
      notification.value = {
        message: 'actions.copy.error',
        color: 'danger',
      };
    }
  };

  const downloadFlag = async () => {
    try {
      await useDownloadFlag(
        document,
        t('actions.download.filename'),
        sizing.value
      );
    } catch (e) {
      console.error(e);
      notification.value = {
        message: 'actions.download.error',
        color: 'danger',
      };
    }
  };
</script>

<template>
  <PanelBar name="title.short" :color="panelColor" class="px-4 py-3">
    <IconButton
      @click="enterFlagDisplay"
      icon="fullscreen"
      :data-tooltip="$t('actions.fullScreen')"
      :aria-label="$t('actions.fullScreen')"
      class="has-tooltip-bottom is-hidden-tablet"
    />
    <IconButton
      @click="copyToClipboard"
      icon="content_copy"
      :data-tooltip="$t('actions.copy.title')"
      :aria-label="$t('actions.copy.title')"
      class="has-tooltip-bottom"
    />
    <IconButton
      @click="downloadFlag"
      icon="file_download"
      :data-tooltip="$t('actions.download.title')"
      :aria-label="$t('actions.download.title')"
      class="has-tooltip-bottom"
    />
    <IconButton
      icon="language"
      :data-tooltip="$t('actions.language.title')"
      :aria-label="$t('actions.language.title')"
      class="has-tooltip-left"
      @click.prevent.left="cycleLanguage"
    />
    <IconButton
      :icon="darkChangeText + '_mode'"
      :data-tooltip="$t('options.mode.' + darkChangeText)"
      :aria-label="$t('options.mode.' + darkChangeText)"
      class="has-tooltip-left"
      @click="isDark = !isDark"
    />
  </PanelBar>
  <div class="px-4 py-3" v-bind="$attrs">
    <SizingButton class="mb-2" />
    <RemainderButton class="mb-3" />
    <RenderingOptions />
    <About />
  </div>
</template>
