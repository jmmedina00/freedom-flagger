<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps({
    values: Array,
    modelValue: null,
  });
  const emit = defineEmits(['update:modelValue']);

  const currentValue = ref(props.modelValue);
  const model = computed({
    get: () => currentValue.value,
    set: (value) => {
      currentValue.value = value;
      emit('update:modelValue', value);
    },
  });

  const valuesForModel = props.values.map(([realValue]) => realValue);

  if (!valuesForModel.includes(currentValue.value)) {
    model.value = valuesForModel[0];
  }
</script>

<template>
  <div class="tabs is-centered">
    <ul class="m-0">
      <li
        v-for="[realValue, displayValue] in values"
        :class="{ 'is-active': currentValue === realValue }"
        @click="model = realValue"
      >
        <a>{{ $t(displayValue) }}</a>
      </li>
    </ul>
  </div>
</template>
