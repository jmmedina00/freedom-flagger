<script setup>
  import { computed, inject, ref } from 'vue';
  import { FULL_FLAG_DISPLAY, NOTIFICATION } from '@app/state';
  import OptionButton from './OptionButton.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import PanelBar from '../shared/PanelBar.vue';

  import IconButton from '../../shared/IconButton.vue';
  import SizingAdjustModal from './modal/SizingAdjustModal.vue';
  import SizingButton from './button/SizingButton.vue';
  import ColumnLimiter from './ColumnLimiter.vue';
  import { useExportToClipboard } from './export/clipboard';
  import { useDownloadFlag } from './export/download';
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { useI18n } from 'vue-i18n';

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

  const flag = ref(false);
  const flagged = () => flag;

  const flagIcon = computed(() => (flag.value ? 'done' : 'close'));

  const toggleFlag = () => {
    flag.value = !flag.value;

    notification.value = {
      message: 'test',
      color: 'danger',
    };
  };
</script>

<template>
  <div>
    <PanelBar :name="$t('test')" color="primary">
      <IconButton @click="toggleFlag" :icon="flagIcon" />
      <IconButton @click="enterFlagDisplay" icon="icons/flag-stripes.svg" />
    </PanelBar>
    <ModalCoupler label="khe" :enabled="flagged()">
      <template #default="{ clicked }">
        <OptionButton
          @click="clicked"
          icon="icons/flag-stripes.svg"
          :secondary="$t('test')"
        >
          <template v-slot:primary> 300 x <i>200</i> </template>
          <template v-slot:secondary><b>Khe</b></template>
        </OptionButton>
      </template>

      <template #content>
        <div class="modal-content">
          <div class="box">{{ new Date() }}</div>
        </div>
      </template>
    </ModalCoupler>
    <SizingButton />

    <OptionButton @click="testClipboard" icon="icons/flag-stripes.svg">
      <template v-slot:primary> 300 x <i>200</i> </template>
    </OptionButton>
    <button @click="testDownload">Test</button>
    <OptionButton
      @click="testDownload"
      icon="icons/flag-stripes.svg"
      :secondary="$t('test')"
    />
    <ModalCoupler label="what" />
    <ModalCoupler :component="SizingAdjustModal" v-slot="{ clicked }">
      <IconButton @click="clicked" icon="terminal" />
    </ModalCoupler>
    <ColumnLimiter />
  </div>
</template>
