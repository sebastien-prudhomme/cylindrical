<template>
  <q-page class="q-pa-md">
    <h4 class="q-mt-none gt-sm">
      {{ $t('menu_testssl') }}
    </h4>
    <q-card v-if="testsslJob" bordered class="bg-blue-2" flat>
      <q-card-section>
        <div>Id: {{ testsslJob.id }}</div>
        <div v-for="parameter in testsslJob.parameters" v-bind:key="parameter.name">
          <div>Name: {{ parameter.name }}</div>
          <div>Value: {{ parameter.value }}</div>
        </div>
        <div>Phase: {{ testsslJob.phase }}</div>
      </q-card-section>
    </q-card>
    <q-card v-if="testsslJobError" bordered class="bg-red-2 text-negative" flat>
      <q-card-section>
        <q-icon left name="warning" size="md" />
        {{ testsslJobError.message }}
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="!testsslJob && !testsslJobError" />
  </q-page>
</template>

<script>
import { makeGetMixin } from 'feathers-vuex'

export default {
  name: 'Job',
  mixins: [makeGetMixin({
    service: 'testssl-jobs',
    id () { return this.$route.params.id }
  })]
}
</script>
