<script setup>
  import { computed, inject, ref } from 'vue';
  import { FULL_FLAG_DISPLAY } from '@app/state';
  import OptionButton from './OptionButton.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import ModalTemplate from '../shared/modal/ModalTemplate.vue';
  import TestModal from '../shared/TestModal.vue';
  import DiscreteIcon from '../../shared/DiscreteIcon.vue';
  import PanelBar from '../shared/PanelBar.vue';
  import { NOTIFICATION } from '../../../state';

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
</script>

<template>
  <div>
    <PanelBar :name="$t('test')">
      <DiscreteIcon class="clickable" @click="toggleFlag" :icon="flagIcon" />
      <DiscreteIcon
        class="clickable"
        @click="enterFlagDisplay"
        icon="icons/flag-stripes.svg"
      />
    </PanelBar>
    <ModalCoupler label="khe" :enabled="flagged()">
      <template #button="{ clicked }">
        <OptionButton
          @click="clicked"
          icon="icons/flag-stripes.svg"
          :secondary="$t('test')"
        >
          <template v-slot:primary> 300 x <i>200</i> </template>
          <template v-slot:secondary><b>Khe</b></template>
        </OptionButton>
      </template>

      <template #default>
        <ModalTemplate>
          <div class="modal-content">
            <div class="box">{{ new Date() }}</div>
          </div>
        </ModalTemplate>
      </template>
    </ModalCoupler>

    <OptionButton @click="enterFlagDisplay" icon="icons/flag-stripes.svg">
      <template v-slot:primary> 300 x <i>200</i> </template>
    </OptionButton>
    <OptionButton
      @click="enterFlagDisplay"
      icon="icons/flag-stripes.svg"
      :secondary="$t('test')"
    />
    <ModalCoupler label="what" />
    <ModalCoupler label="wut">
      <TestModal />
    </ModalCoupler>
  </div>
</template>
