<script setup>
  import DiscreteIcon from '@app/components/shared/DiscreteIcon.vue';

  const props = defineProps({
    icon: String,
    primary: String,
    secondary: String,
  });
</script>

<template>
  <button
    class="button is-flex is-justify-content-space-between"
    @click="$emit('click')"
  >
    <DiscreteIcon :icon="icon" />

    <span class="primary" v-if="primary || $slots.primary">
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
    text-align: center;
  }

  .secondary {
    line-height: 1.5rem;
  }
</style>
