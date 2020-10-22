<template>
  <q-page class="q-pa-md">
    <h4 class="q-mt-none gt-sm">
      {{ $t('menu_testssl') }}
    </h4>
    <q-form class="q-gutter-md" greedy ref="form" @submit="submit">
      <q-input :label="$t('target')" lazy-rules outlined :rules="targetRules" stack-label v-model="target" />
      <div class="row justify-end">
        <q-btn color="primary" icon="fas fa-play" :label="$t('submit')" :loading="loading" outline type="submit">
          <template v-slot:loading>
            <q-spinner class="on-left" />
            {{ $t('submit') }}
          </template>
        </q-btn>
      </div>
    </q-form>
    <div v-for="testsslJob in testsslJobs" :key="testsslJob.id">
      <q-card v-if="testsslJob" bordered class="bg-blue-2 cursor-pointer" flat @click="$router.push(`/${testsslJob.id}`)">
        <q-card-section>
          <div>Id: {{ testsslJob.id }}</div>
          <div v-for="parameter in testsslJob.parameters" :key="parameter.name">
            <div>Name: {{ parameter.name }}</div>
            <div>Value: {{ parameter.value }}</div>
          </div>
          <div>Phase: {{ testsslJob.phase }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import validate from '../helpers/validate'
import Joi from '@hapi/joi'

export default {
  name: 'Index',
  mixins: [makeFindMixin({
    service: 'testssl-jobs'
  })],
  data () {
    return {
      target: '',
      loading: false
    }
  },
  computed: {
    testsslJobsParams () {
      const query = {}

      return { query }
    },
    targetRules: function () {
      return validate(Joi.string().domain())
    }
  },
  methods: {
    submit: async function () {
      const parameters = {
        target: this.target
      }

      this.loading = true

      let testsslJob

      try {
        testsslJob = await this.$store.dispatch('testssl-jobs/create', parameters)

        this.target = ''

        this.$refs.form.reset()
      } catch (error) {
        console.log(error)
      }

      this.loading = false

      this.$router.push(`/${testsslJob.id}`)
    }
  }

}
</script>
