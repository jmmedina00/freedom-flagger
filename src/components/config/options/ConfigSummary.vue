<script setup>
  import { inject } from 'vue';
  import { FULL_FLAG_DISPLAY } from '../../../state';
  import OptionButton from './OptionButton.vue';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);

  const enterFlagDisplay = () => {
    fullFlagDisplay.value = true;
  };
</script>

<template>
  <div>
    <OptionButton
      @click="enterFlagDisplay"
      icon="icons/flag-stripes.svg"
      :secondary="$t('test')"
    >
      <template v-slot:primary> 300 x <i>200</i> </template>
    </OptionButton>
    <OptionButton @click="enterFlagDisplay" icon="icons/flag-stripes.svg">
      <template v-slot:primary> 300 x <i>200</i> </template>
    </OptionButton>
    <OptionButton
      @click="enterFlagDisplay"
      icon="icons/flag-stripes.svg"
      :secondary="$t('test')"
    />
  </div>
</template>
