<script setup>
  import ModalCoupler from '../../shared/modal/ModalCoupler.vue';
  import OptionButton from '../OptionButton.vue';

  // Button plus modal, all in one
</script>

<template>
  <ModalCoupler>
    <template #default="{ clicked }">
      <hr class="mt-1" />
      <OptionButton
        @click="clicked"
        class="mt-6"
        icon="info"
        :primary="$t('actions.about.title')"
        :aria-label="$t('actions.about.title')"
      />
    </template>
    <template #content>
      <div class="modal-content">
        <div class="box">
          <div class="is-flex is-justify-content-center">
            <figure class="image is-128x128 has-text-centered">
              <img src="/logo192.png" />
            </figure>
          </div>

          <h1 class="has-text-centered">{{ $t('title.main') }}</h1>

          <i18n-t
            keypath="actions.about.main"
            tag="p"
            class="has-text-centered"
          >
            <template #author>
              <a
                href="https://www.linkedin.com/in/juan-miguel-medina-prieto-88926715a/"
              >
                Juan Miguel Medina Prieto
              </a>
            </template>
            <template #license>
              <a
                href="https://github.com/jmmedina00/freedom-flagger/blob/main/LICENSE"
              >
                {{ $t('actions.about.license') }}
              </a>
            </template>
          </i18n-t>
        </div>
      </div>
    </template>
  </ModalCoupler>
</template>
