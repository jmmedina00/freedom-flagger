<script setup>
  import { computed } from 'vue';
  import DiscreteIcon from '@app/components/shared/DiscreteIcon.vue';

  const props = defineProps({
    id: { type: String, default: 'temp' },
    icon: String,
    label: String,
    value: String,
    modelValue: [String, Array],
    disabled: Boolean,
    type: {
      type: String,
      default: 'radio',
    },
  });
  const emit = defineEmits(['update:modelValue']);
  const currentValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });

  const explicitlySet = ({ code = '' }) => {
    if (['Space', 'Enter'].includes(code)) {
      currentValue.value = props.value;
    }
  }; // TODO - refactor into checkbox, derive radio option from this
</script>

<template>
  <input
    :id="id"
    :type="type"
    :value="value"
    v-model="currentValue"
    :disabled="disabled"
  />
  <label
    class="option-display is-inline-flex is-flex-direction-column"
    v-bind="$attrs"
    role="button"
    :for="id"
    tabindex="0"
    :aria-label="$t(label)"
    @keydown="explicitlySet"
  >
    <div class="icon-holder is-flex">
      <DiscreteIcon :icon="icon" :size="48" />
    </div>

    <span>{{ $t(label) }}</span>
  </label>
</template>

<style scoped lang="scss">
  .option-display {
    text-align: center;
    cursor: pointer;
  }

  .icon-holder {
    background: #80ffec;
    border-radius: 16px;
    padding: 8px;
  }

  input[type='radio'],
  input[type='checkbox'] {
    text-align: center;
    cursor: pointer;
    display: none;

    &:disabled + .option-display {
      opacity: 0.5;
    }

    &:checked + .option-display {
      font-weight: bold;
      .icon-holder {
        background: #485fc7; // Copied straight from Bulma

        .icon {
          color: white;
        }
      }
    }
  }
</style>
