<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps({
    base: ref(16),
    number: ref([0]),
  });

  const number = ref(props.number);
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
  <p>
    <span v-for="byte in spacedBytes">{{ byte + ' ' }}</span>
    <span>{{ lastByte }}</span>
  </p>
</template>
