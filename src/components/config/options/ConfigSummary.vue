<script setup>
  import { computed, inject, ref } from 'vue';
  import {
    CONFIG_MAX_COLUMNS,
    FULL_FLAG_DISPLAY,
    NOTIFICATION,
  } from '@app/state';
  import OptionButton from './OptionButton.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import PanelBar from '../shared/PanelBar.vue';
  import { useSomeConfig } from './plugin';
  import IconButton from '../../shared/IconButton.vue';
  import SizingAdjustModal from './modal/SizingAdjustModal.vue';
  import SizingButton from './button/SizingButton.vue';
  import LimitedSliderNumber from './util/LimitedSliderNumber.vue';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);
  const notification = inject(NOTIFICATION);

  const enterFlagDisplay = () => {
    fullFlagDisplay.value = true;
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

  const maxColumns = useSomeConfig(CONFIG_MAX_COLUMNS, 12);
</script>

<template>
  <div>
    <PanelBar :name="$t('test')">
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

    <OptionButton @click="enterFlagDisplay" icon="icons/flag-stripes.svg">
      <template v-slot:primary> 300 x <i>200</i> </template>
    </OptionButton>
    <OptionButton
      @click="enterFlagDisplay"
      icon="icons/flag-stripes.svg"
      :secondary="$t('test')"
    />
    <ModalCoupler label="what" />
    <ModalCoupler :component="SizingAdjustModal" v-slot="{ clicked }">
      <IconButton @click="clicked" icon="terminal" />
    </ModalCoupler>
    <p>
      <span class="is-block">{{ $t('config.maxColumns') + ':' }}</span>
      <LimitedSliderNumber v-model="maxColumns" :min="0" :max="32" />
    </p>
  </div>
</template>
