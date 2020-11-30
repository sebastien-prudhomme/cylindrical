<template>
  <q-page padding>
    <div class="bg-white q-pa-md rounded-borders">
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
    </div>
    <div v-for="testsslJob in testsslJobs" :key="testsslJob.id">
      <q-card v-if="testsslJob" bordered class="bg-blue-2 cursor-pointer" flat @click="$router.push(`/${testsslJob.id}`)">
        <q-card-section>
          <div>Id: {{ testsslJob.id }}</div>
          <div v-for="parameter in testsslJob.parameters" :key="parameter.name">
            <div>Name: {{ parameter.name }}</div>
            <div>Value: {{ parameter.value }}</div>
          </div>
          <div>
            <q-spinner v-if="testsslJob.phase === 'Running'" class="on-left" :color="jobColor(testsslJob)" size="sm" />
            <q-icon v-if="testsslJob.phase !== 'Running'" class="on-left" :color="jobColor(testsslJob)" :name="jobIcon(testsslJob)" size="sm" />
            {{ testsslJob.phase }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import { jobColorHelper, jobIconHelper } from '../helpers/job'
import { validateHelper } from '../helpers/validate'
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
    jobColor: function () {
      return function (job) {
        return jobColorHelper(job)
      }
    },
    jobIcon: function () {
      return function (job) {
        return jobIconHelper(job)
      }
    },
    testsslJobsParams () {
      const query = {}

      return { query }
    },
    targetRules: function () {
      return validateHelper(Joi.string().domain())
    }
  },
  methods: {
    submit: async function () {
      const data = {
        parameters: [
          {
            name: 'target',
            value: this.target
          }
        ]
      }

      this.loading = true

      let testsslJob

      try {
        testsslJob = await this.$store.dispatch('testssl-jobs/create', data)

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
