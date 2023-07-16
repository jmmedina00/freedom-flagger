<script setup>
  import { computed, inject, ref, watch } from 'vue';
  import { useSomeConfig } from '../plugin';
  import { CONFIG_SIZING } from '@app/state';
  import IconRadioOption from '../IconRadioOption.vue';
  import IconButton from '@app/components/shared/IconButton.vue';
  import { useCalculatedSizes } from '../../../shared/sizing';
  import { parseAsIntOrNothing } from '../../shared/numeric';
  import { MODAL_ACTIVE } from '@app/state';

  const ratioLists = [
    { ratio: [3, 2], icon: 'bolt' },
    { ratio: [5, 3], icon: 'key' },
    { ratio: [4, 3], icon: 'sync' },
    { ratio: [16, 9], icon: 'undo' },
    { ratio: [1, 1], icon: 'forward' },
  ];

  const getRatioLabel = ([one, two]) => `${one}:${two}`;

  const config = useSomeConfig(CONFIG_SIZING, {
    width: 300,
    height: undefined,
    aspectRatio: { x: 3, y: 2 },
  });

  const verticallyOriented = ref(
    config.value.aspectRatio.x < config.value.aspectRatio.y
  );
  const orientation = computed(() =>
    verticallyOriented.value ? 'swap_vert' : 'swap_horiz'
  );

  const toggleOrientation = () => {
    verticallyOriented.value = !verticallyOriented.value;
  };

  const active = inject(MODAL_ACTIVE);

  const editedConfig = ref({ ...config.value });
  const fullDimensions = useCalculatedSizes(editedConfig);

  const applyConfig = () => {
    config.value = { ...editedConfig.value };
    active.value = false;
  };

  const useFromEditedConfig = (attribute, parser = (value) => value) =>
    computed({
      get: () => editedConfig.value[attribute],
      set: (value) => {
        const parsedValue = parser(value);
        const originalValue = editedConfig.value[attribute];

        if (parsedValue === 0) {
          editedConfig.value[attribute] = undefined;
          return;
        }

        if (parsedValue !== undefined) {
          editedConfig.value[attribute] = parsedValue;
          return;
        }

        editedConfig.value[attribute] = 0;
        editedConfig.value[attribute] = originalValue;
      },
    });

  const width = useFromEditedConfig('width', parseAsIntOrNothing);
  const height = useFromEditedConfig('height', parseAsIntOrNothing);

  const decomposedAspectRatio = computed(() => {
    if (!editedConfig.value.aspectRatio) return null;

    const { x, y } = editedConfig.value.aspectRatio;
    const list = verticallyOriented.value ? [y, x] : [x, y];

    return getRatioLabel(list);
  });

  const aspectRatio = ref(decomposedAspectRatio.value);

  watch([aspectRatio, verticallyOriented], ([ratio, revert]) => {
    if (!ratio) {
      editedConfig.value.aspectRatio = null;
      return;
    }

    const [one, two] = ratio.split(':').map((x) => parseInt(x));
    const aspectRatio = revert ? { y: one, x: two } : { x: one, y: two };
    editedConfig.value.aspectRatio = aspectRatio;
  });

  const isEverythingValid = computed(
    () =>
      (!!width.value || !!fullDimensions.value.width) &&
      (!!height.value || !!fullDimensions.value.height)
  );

  const bothPopulated = computed(() => !!width.value && !!height.value);

  watch(bothPopulated, (trigger) => {
    if (trigger) {
      aspectRatio.value = null;
    }
  });
</script>

<template>
  <div class="modal-content">
    <div class="box">
      <!-- Pseudo-header -->
      <div class="is-flex">
        <IconRadioOption
          v-for="{ ratio, icon } in ratioLists"
          :id="getRatioLabel(ratio)"
          :value="getRatioLabel(ratio)"
          :label="getRatioLabel(ratio)"
          :icon="icon"
          v-model="aspectRatio"
          :disabled="bothPopulated"
        />
        <!-- Disable non-custom options when both things are populated -->
        <IconRadioOption
          id="custom"
          :value="null"
          label="custom"
          icon="logout"
          v-model="aspectRatio"
        />
      </div>
      <div>
        <input
          id="width"
          class="input numeric"
          maxlength="4"
          type="text"
          :placeholder="fullDimensions.width"
          v-model="width"
        />
        <span>x</span>
        <input
          id="height"
          class="input numeric"
          maxlength="4"
          type="text"
          :placeholder="fullDimensions.height"
          v-model="height"
        />
        <IconButton :icon="orientation" @click="toggleOrientation" />
      </div>
      <button
        class="button is-success"
        :disabled="!isEverythingValid"
        @click="applyConfig"
      >
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .numeric {
    width: 4rem;
  }
</style>
