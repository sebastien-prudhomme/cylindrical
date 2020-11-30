<template>
  <q-layout class="layout">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal>
      <app-footer />
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
    AppFooter: () => import('components/AppFooter')
  }
}
</script>

<style lang="sass">
.layout
  background-image: url(~assets/hero-blue.svg)
  background-position: center
  background-size: cover
</style>
