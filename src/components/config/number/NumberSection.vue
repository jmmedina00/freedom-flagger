<script setup>
  import { computed, inject, ref } from 'vue';
  import PanelBar from '../shared/PanelBar.vue';
  import NumberSummary from './write/NumberSummary.vue';
  import NumberCarousel from './read/NumberCarousel.vue';
  import IconButton from '../../shared/IconButton.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import NumberFromTextModal from './modal/NumberFromTextModal.vue';
  import NumberFromFileModal from './modal/NumberFromFileModal.vue';
  import { NOTIFICATION, NUMBER_BYTES } from '@app/state';
  import { useLinkToCurrentNumber } from './link';

  const expanded = ref(false);
  const number = inject(NUMBER_BYTES, ref([0]));
  const notification = inject(NOTIFICATION, ref(null));
  const link = useLinkToCurrentNumber(number);

  const toggleExpanded = () => {
    expanded.value = !expanded.value;
  };

  const buttonLocale = computed(() => (expanded.value ? 'down' : 'up'));
  const buttonIcon = computed(
    () => 'keyboard_double_arrow_' + buttonLocale.value
  );

  const provideLink = async () => {
    try {
      await navigator.clipboard.writeText(link.value);
      notification.value = {
        message: 'actions.link.success',
        color: 'success',
      };
    } catch (e) {
      console.error(e);
      notification.value = {
        message: 'actions.link.error',
        color: 'danger',
      };
    }
  };
</script>

<template>
  <PanelBar name="number.title" color="info" class="px-4 py-3">
    <ModalCoupler :component="NumberFromTextModal" v-slot="{ clicked }">
      <IconButton
        icon="text_fields"
        @click="clicked"
        :data-tooltip="$t('actions.provide.text.title')"
        :aria-label="$t('actions.provide.text.title')"
      />
    </ModalCoupler>
    <ModalCoupler :component="NumberFromFileModal" v-slot="{ clicked }">
      <IconButton
        icon="file_upload"
        @click="clicked"
        :data-tooltip="$t('actions.provide.file.title')"
        :aria-label="$t('actions.provide.file.title')"
      />
    </ModalCoupler>
    <IconButton
      icon="link"
      @click="provideLink"
      :data-tooltip="$t('actions.link.title')"
      :aria-label="$t('actions.link.title')"
    />
    <IconButton
      :icon="buttonIcon"
      @click="toggleExpanded"
      :data-tooltip="$t(expanded ? 'actions.read' : 'actions.edit')"
      :aria-label="$t(expanded ? 'actions.read' : 'actions.edit')"
      class="has-tooltip-left"
    />
  </PanelBar>
  <div class="px-4 py-3" v-bind="$attrs">
    <NumberSummary v-if="expanded" />
    <NumberCarousel v-else />
  </div>
</template>

<style scoped>
  .bottom-pad {
    padding-bottom: 3em;
  }
</style>
