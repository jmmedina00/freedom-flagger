<script setup>
  import { computed, inject, ref } from 'vue';
  import { NUMBER_BYTES } from '@app/state';

  const props = defineProps({ base: ref(16) });
  const number = inject(NUMBER_BYTES, ref([0]));
  const base = ref(props.base);

  const byteLength = computed(() => (0xff).toString(base.value).length);

  const padded = computed(() =>
    number.value.map((byte) =>
      byte.toString(base.value).padStart(byteLength.value, '0').toUpperCase()
    )
  );

  const spacedBytes = computed(() =>
    padded.value.filter((_, index, arr) => index < arr.length - 1)
  );
  const lastByte = computed(() =>
    padded.value.find((_, index, arr) => index === arr.length - 1)
  );
</script>

<template>
  <span v-for="byte in spacedBytes">{{ byte + ' ' }}</span>
  <span>{{ lastByte }}</span>
</template>
