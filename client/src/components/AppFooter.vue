<template>
  <div class="bg-black q-pa-xs rounded-borders text-weight-medium text-white">
    <span class="q-pa-sm">
      {{ $t('build_with') }}
    </span>
    <btn-credit href="https://argoproj.github.io/" img="argo.png" label="Argo" />
    <btn-credit href="https://feathersjs.com/" img="feathers.png" label="Feathers" />
    <btn-credit href="https://quasar.dev/" img="quasar.png" label="Quasar" />
    <btn-credit href="https://testssl.sh/" img="testssl.png" label="Testssl" />
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  components: {
    BtnCredit: () => import('components/BtnCredit')
  }
}
</script>
