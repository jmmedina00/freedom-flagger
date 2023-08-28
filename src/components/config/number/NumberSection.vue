<script setup>
  import { computed, inject, ref } from 'vue';
  import PanelBar from '../shared/PanelBar.vue';
  import NumberSummary from './write/NumberSummary.vue';
  import NumberCarousel from './read/NumberCarousel.vue';
  import IconButton from '../../shared/IconButton.vue';
  import ModalCoupler from '../shared/modal/ModalCoupler.vue';
  import NumberFromTextModal from './modal/NumberFromTextModal.vue';
  import NumberFromFileModal from './modal/NumberFromFileModal.vue';
  import { NUMBER_BYTES } from '@app/state';
  import { useLinkToCurrentNumber } from './link';

  const expanded = ref(false);
  const number = inject(NUMBER_BYTES, ref([0]));
  const link = useLinkToCurrentNumber(number);

  const toggleExpanded = () => {
    expanded.value = !expanded.value;
  };

  const buttonLocale = computed(() => (expanded.value ? 'down' : 'up'));
  const buttonIcon = computed(
    () => 'keyboard_double_arrow_' + buttonLocale.value
  );

  const shareLink = async () => {
    /* window.navigator.canShare(link.value);
    window.navigator.share(link.value); */

    await navigator.clipboard.writeText(link.value);

    /* share({ url:  }); */
  };
</script>

<template>
  <PanelBar :name="$t('tabs')" color="info" class="px-4 py-3">
    <ModalCoupler :component="NumberFromTextModal" v-slot="{ clicked }">
      <IconButton icon="text_fields" @click="clicked" />
    </ModalCoupler>
    <ModalCoupler :component="NumberFromFileModal" v-slot="{ clicked }">
      <IconButton icon="file_upload" @click="clicked" />
    </ModalCoupler>
    <IconButton icon="share" @click="shareLink" />
    <IconButton :icon="buttonIcon" @click="toggleExpanded" />
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
