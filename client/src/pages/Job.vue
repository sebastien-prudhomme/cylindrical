<template>
  <q-page class="q-pa-md">
    <q-card v-if="testsslJob" bordered class="bg-blue-2" flat>
      <q-card-section>
        <div>Id: {{ testsslJob.id }}</div>
        <div v-for="parameter in testsslJob.parameters" :key="parameter.name">
          <div>Name: {{ parameter.name }}</div>
          <div>Value: {{ parameter.value }}</div>
        </div>
        <div>Phase: {{ testsslJob.phase }}</div>
        <pre class="bg-black overflow-auto q-ma-none q-pa-md rounded-borders text-white" v-html="html" />
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
import AnsiToHtml from 'ansi-to-html'
import { makeGetMixin } from 'feathers-vuex'

export default {
  name: 'Job',
  mixins: [makeGetMixin({
    service: 'testssl-jobs',
    id () { return this.$route.params.id }
  })],
  computed: {
    artifact: function () {
      return function (type) {
        const artifactId = `${this.testsslJob.id}/output.${type}`
        const artifact = this.testsslJob.artifacts.find(artifact => artifact.id === artifactId)

        return artifact
      }
    },
    html: function () {
      const log = this.artifact('log').content
      const html = new AnsiToHtml({ newline: true }).toHtml(log)

      return html
    },
    testsslJobParams () {
      return { $populateParams: { name: 'withArtifacts' } }
    }
  }
}
</script>
