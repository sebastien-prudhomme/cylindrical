<template>
  <div>
    <div v-if="pending && pendingMax">
      {{ $t('pending_jobs', { pending: pending.value, pendingMax: pendingMax.value }) }}
      <q-linear-progress class="q-mt-xs" :color="color" size="md" :value="pending.value / pendingMax.value" />
    </div>
    <div v-else>
      <q-skeleton animation="fade" height="21px" type="rect" width="128px" />
      <q-skeleton animation="fade" class="q-mt-xs" height="6px" type="rect" width="128px" />
    </div>
  </div>
</template>

<script>
import { makeGetMixin } from 'feathers-vuex'

export default {
  name: 'Pending',
  mixins: [
    makeGetMixin({
      service: 'testssl-job-stats',
      id () { return 'pending' },
      name: 'pending'
    }),
    makeGetMixin({
      service: 'testssl-job-stats',
      id () { return 'pendingMax' },
      name: 'pendingMax'
    })
  ],
  computed: {
    color: function () {
      return this.pending.value >= this.pendingMax.value ? 'negative' : 'positive'
    }
  }
}
</script>
