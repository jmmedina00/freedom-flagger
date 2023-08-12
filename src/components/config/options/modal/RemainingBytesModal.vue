<script setup>
  import MosaicDecorate from '@app/components/shared/decorate/MosaicDecorate.vue';
  import DemoMiniFlag from '../util/DemoMiniFlag.vue';
  import ModalTitle from '../../shared/modal/ModalTitle.vue';
  import { computed, provide, ref } from 'vue';
  import { DECORATE_CONFIG } from '@app/state';
  import StrictNumberInput from '../util/numeric/StrictNumberInput.vue';
  import IconOption from '../util/icon/IconOption.vue';
  import BorderDecorate from '@app/components/shared/decorate/BorderDecorate.vue';
  import { TOP_LEFT } from '@app/components/shared/decorate/corner';
  import InfiniteDecorate from '@app/components/shared/decorate/InfiniteDecorate.vue';
  import CornerTriangleDecorate from '@app/components/shared/decorate/CornerTriangleDecorate.vue';

  const props = defineProps(['foo']);

  /* const squares = ref(25);
  const rows = ref(2);
  const offset = ref(1); */

  const size = ref(20);
  /* const left = ref('');
  const right = ref('');
  const top = ref('');
  const bottom = ref(''); */

  const topLeft = ref('');
  const topRight = ref('');
  const bottomLeft = ref('');
  const bottomRight = ref('');

  const directions = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
  const icons = ['add', 'delete', 'arrow_back', 'star'];
  const colors = ['#cc6632', '#7ced08', '#d68f44'];
  const corner = ref(TOP_LEFT);

  /* const test = computed(() => ({
    colors: ['#ff6347', '#800000', '#ff00ff'],
    squareRows: squares.value,
    rows: rows.value,
    offset: offset.value || 0,
  })); */
  /* const test = computed(() => ({
    size: size.value,
    left: left.value || null,
    right: right.value || null,
    top: top.value || null,
    bottom: bottom.value || null,
  })); */

  /* const test = computed(() => ({
    size: size.value,
    colors,
    corner: corner.value,
  })); */

  const test = computed(() => ({
    size: size.value,
    topLeft: topLeft.value || null,
    topRight: topRight.value || null,
    bottomLeft: bottomLeft.value || null,
    bottomRight: bottomRight.value || null,
  }));

  provide(DECORATE_CONFIG, test);

  const options = ref(['dis', 'nu', 'option']);
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <ModalTitle name="config.remainder" />
      <DemoMiniFlag :component="CornerTriangleDecorate" />
      <!-- <p>
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
      </p> -->

      <p>
        <span>{{ $t('config.remainder.size') }}</span>
        <StrictNumberInput class="input" v-model="size" />
      </p>
      <!-- <p>
        <IconOption
          v-for="(direction, index) in directions"
          :id="direction"
          :value="index"
          :label="direction"
          :icon="icons[index]"
          v-model="corner"
        />
      </p> -->

      <p>
        <span>{{ $t('config.remainder.topLeft') }}</span>
        <input type="color" v-model="topLeft" />
        <button @click="topLeft = null">X</button>
      </p>
      <p>
        <span>{{ $t('config.remainder.topRight') }}</span>
        <input type="color" v-model="topRight" />
        <button @click="topRight = null">X</button>
      </p>
      <p>
        <span>{{ $t('config.remainder.bottomRight') }}</span>
        <input type="color" v-model="bottomRight" />
        <button @click="bottomRight = null">X</button>
      </p>
      <p>
        <span>{{ $t('config.remainder.bottomLeft') }}</span>
        <input type="color" v-model="bottomLeft" />
        <button @click="bottomLeft = null">X</button>
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
