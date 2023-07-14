<script setup>
  import { computed } from 'vue';
  import DiscreteIcon from '../../shared/DiscreteIcon.vue';

  const props = defineProps({
    id: { type: String, default: 'temp' },
    icon: String,
    label: String,
    value: String,
    modelValue: String,
  });
  const emit = defineEmits(['update:modelValue']);
  const currentValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <input :id="id" type="radio" :value="value" v-model="currentValue" />
  <label
    class="option-display is-inline-flex is-flex-direction-column"
    role="button"
    :for="id"
    tabindex="0"
    :aria-label="$t(label)"
  >
    <div class="icon-holder is-flex">
      <DiscreteIcon :icon="icon" size="48" />
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

  input[type='radio'] {
    display: none;

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
