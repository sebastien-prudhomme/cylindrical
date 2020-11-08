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
          <div>
            <q-spinner v-if="testsslJob.phase === 'Running'" class="on-left" :color="jobColor(testsslJob)" size="sm" />
            <q-icon v-if="testsslJob.phase !== 'Running'" class="on-left" :color="jobColor(testsslJob)" :name="jobIcon(testsslJob)" size="sm" />
            {{ testsslJob.phase }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="bg-black rounded-borders text-weight-medium text-white">
      <span class="q-pa-sm">
        Build with
      </span>
      <q-btn dense href="https://argoproj.github.io/" no-caps type="a">
        <q-chip color="secondary" square text-color="white">
          <q-avatar>
            <img src="~assets/argo.png">
          </q-avatar>
          Argo
        </q-chip>
      </q-btn>
      <q-btn dense href="https://feathersjs.com/" no-caps type="a">
        <q-chip color="secondary" square text-color="white">
          <q-avatar>
            <img src="~assets/feathers.png">
          </q-avatar>
          Feathers
        </q-chip>
      </q-btn>
      <q-btn dense href="https://quasar.dev/" no-caps type="a">
        <q-chip color="secondary" square text-color="white">
          <q-avatar>
            <img src="~assets/quasar.png">
          </q-avatar>
          Quasar
        </q-chip>
      </q-btn>
      <q-btn dense href="https://testssl.sh/" no-caps type="a">
        <q-chip color="secondary" square text-color="white">
          <q-avatar>
            <img src="~assets/testssl.png">
          </q-avatar>
          Testssl
        </q-chip>
      </q-btn>
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
