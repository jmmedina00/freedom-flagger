<script setup>
  import { computed } from 'vue';
  import DiscreteIcon from '@app/components/shared/DiscreteIcon.vue';
  import { useDarkAlternate } from '@app/util/dark';

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
  };

  const alternateClasses = useDarkAlternate([], ['has-background-primary']);
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
    class="option-display has-tooltip-arrow is-inline-flex is-flex-direction-column is-align-items-center"
    :data-tooltip="$t(label)"
    v-bind="$attrs"
    role="button"
    :for="id"
    tabindex="0"
    :aria-label="$t(label)"
    @keydown="explicitlySet"
  >
    <div class="icon-holder is-flex" :class="alternateClasses">
      <DiscreteIcon :icon="icon" :size="48" />
    </div>

    <span class="is-hidden">{{ $t(label) }}</span>
  </label>
</template>

<style scoped lang="scss">
  @use 'sass:color';
  .option-display {
    text-align: center;
    cursor: pointer;
  }

  .icon-holder {
    background: color.change(#4f6bed, $lightness: 85%); // Bulma: $primary
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
        background: #881798 !important; // Bulma: $link
        .icon {
          color: white;
        }

        .dark & {
          background: color.change(#881798, $lightness: 60%) !important;

          .icon {
            color: #881798 !important;
          }
        }
      }
    }
  }
</style>
