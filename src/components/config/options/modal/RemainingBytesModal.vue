<script setup>
  import MosaicDecorate from '@app/components/shared/decorate/MosaicDecorate.vue';
  import DemoMiniFlag from '../util/DemoMiniFlag.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';
  import { computed, provide, ref } from 'vue';
  import { DECORATE_CONFIG } from '@app/state';
  import StrictNumberInput from '../util/numeric/StrictNumberInput.vue';
  import IconOption from '../util/icon/IconOption.vue';

  const props = defineProps(['foo']);

  const squares = ref(25);
  const rows = ref(2);
  const offset = ref(1);

  const test = computed(() => ({
    colors: ['#ff6347', '#800000', '#ff00ff'],
    squareRows: squares.value,
    rows: rows.value,
    offset: offset.value || 0,
  }));

  provide(DECORATE_CONFIG, test);

  const options = ref(['dis', 'nu', 'option']);
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="config.remainder" />
      <DemoMiniFlag :component="MosaicDecorate" />
      <p>
        <span>{{ $t('config.remainder.squares') }}</span>
        <StrictNumberInput class="input" v-model="squares" />
      </p>
      <p>
        <span>{{ $t('config.remainder.rows') }}</span>
        <StrictNumberInput class="input" v-model="rows" />
      </p>
      <p>
        <span>{{ $t('config.remainder.offset') }}</span>
        <StrictNumberInput class="input" v-model="offset" />
      </p>

      <IconOption
        type="checkbox"
        icon="settings"
        label="test"
        value="dis"
        v-model="options"
      />
      <p>{{ options }}</p>
    </div>
  </div>
</template>
