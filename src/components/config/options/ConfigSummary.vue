<script setup>
  import { inject } from 'vue';
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

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);
  const notification = inject(NOTIFICATION);
  const sizing = useFullStateSize();
  const { t } = useI18n();

  const enterFlagDisplay = () => {
    fullFlagDisplay.value = true;
  };

  const testClipboard = () => {
    useExportToClipboard(document, sizing.value);
  };

  const testDownload = () => {
    useDownloadFlag(document, t('config.export.flag'), sizing.value);
  };
</script>

<template>
  <div>
    <PanelBar :name="$t('test')" color="primary">
      <IconButton
        icon="close"
        :data-tooltip="$t('number.hex')"
        class="has-tooltip-bottom"
      />
      <IconButton @click="enterFlagDisplay" icon="icons/flag-stripes.svg" />
    </PanelBar>
    <div class="px-4 py-3">
      <SizingButton />
      <RemainderButton />
      <RenderingOptions />
    </div>
  </div>
</template>
