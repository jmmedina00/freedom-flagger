<script setup>
  import DiscreteIcon from '@app/components/shared/DiscreteIcon.vue';
  import { useDarkAlternate } from '@app/util/dark';

  const props = defineProps({
    icon: String,
    primary: String,
    secondary: String,
  });

  const alternatedClasses = useDarkAlternate(
    ['has-background-primary-light'],
    ['has-background-primary', 'has-text-light']
  );
</script>

<template>
  <button class="button" :class="alternatedClasses">
    <DiscreteIcon :icon="icon" />

    <span class="primary ml-6 has-text-left" v-if="primary || $slots.primary">
      <slot name="primary" v-if="$slots.primary"></slot>
      <template v-else>{{ primary }}</template>
    </span>

    <span
      class="secondary is-uppercase has-text-weight-light is-size-7"
      v-if="secondary || $slots.secondary"
    >
      <slot name="secondary" v-if="$slots.secondary"></slot>
      <template v-else>{{ secondary }}</template>
    </span>
  </button>
</template>

<style scoped>
  .button {
    width: 100%;
    padding: 2em 3em;
  }

  .text-holder {
    gap: 4rem;
  }

  .primary {
    margin-right: auto;
  }

  .secondary {
    line-height: 1.5rem;
  }
</style>
