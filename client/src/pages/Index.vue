<template>
  <q-page padding>
    <div class="q-pa-md rounded-borders bg-white">
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
    <div class="q-mt-md">
      <div class="row q-col-gutter-md">
        <div v-for="testsslJob in testsslJobs" :key="testsslJob.id" class="col-xs-12 col-sm-6" >
          <div class="row cursor-pointer rounded-borders bg-white" @click="$router.push(`/${testsslJob.id}`)">
            <div class="text-weight-bold col-xs-12 col-md-6 q-pa-sm text-uppercase ellipsis">
              {{ parameter(testsslJob, 'target') }}
            </div>
            <div class="column items-center justify-center col-xs-6 col-md-3 q-pa-sm">
              <div class="text-center">
                {{ $t('overall_grade') }}
              </div>
              <div class="q-mt-sm">
                <q-avatar v-if="finding(testsslJob, 'overall_grade')" :color="gradeColor(finding(testsslJob, 'overall_grade'))" rounded size="64px" text-color="white">
                  {{ finding(testsslJob, 'overall_grade') }}
                </q-avatar>
                <q-skeleton v-else animation="fade" size="64px" type="rect" />
              </div>
            </div>
            <div class="column items-center justify-center col-xs-6 col-md-3 q-pa-sm">
              <div class="text-center">
                {{ $t('final_score') }}
              </div>
              <div class="q-mt-sm">
                <q-avatar v-if="finding(testsslJob, 'final_score')" :color="scoreColor(finding(testsslJob, 'final_score'))" rounded size="64px" text-color="white">
                  {{ finding(testsslJob, 'final_score') }}
                </q-avatar>
                <q-skeleton v-else animation="fade" size="64px" type="rect" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import { jobFindingHelper, jobGradeColorHelper, jobParameterHelper, jobScoreColorHelper } from '../helpers/job'
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
    finding: function () {
      return jobFindingHelper
    },
    gradeColor () {
      return jobGradeColorHelper
    },
    parameter () {
      return jobParameterHelper
    },
    scoreColor () {
      return jobScoreColorHelper
    },
    testsslJobsParams () {
      return { $populateParams: { name: 'withArtifacts' } }
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
