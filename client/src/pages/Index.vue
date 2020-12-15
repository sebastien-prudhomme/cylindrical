<template>
  <q-page class="q-pa-xs-sm q-pa-sm-md q-pa-lg-lg">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="testsslJobsError" class="q-mb-xs-sm q-mb-sm-md q-mb-lg-lg q-pa-xs-sm q-pa-sm-md q-pa-lg-lg text-negative rounded-borders bg-red-2">
        <q-icon left name="warning" size="md" />
        {{ testsslJobsError.message }}
      </div>
    </transition>
    <div class="q-pa-xs-sm q-pa-sm-md q-pa-lg-lg rounded-borders bg-white">
      <q-form class="q-gutter-md" greedy ref="form" @submit="submit">
        <q-input :label="$t('target')" lazy-rules outlined :rules="targetRules" stack-label v-model="target" />
        <div class="row items-center justify-between">
          <pending />
          <q-btn color="primary" icon="fas fa-play" :label="$t('submit')" :loading="loading" outline type="submit">
            <template v-slot:loading>
              <q-spinner class="on-left" />
              {{ $t('submit') }}
            </template>
          </q-btn>
        </div>
      </q-form>
    </div>
    <div class="q-mt-xs-sm q-mt-sm-md q-mt-lg-lg">
      <div class="row q-col-gutter-xs-sm q-col-gutter-sm-md q-col-gutter-lg-lg">
        <template v-if="haveTestsslJobsLoadedOnce">
          <div v-for="testsslJob in testsslJobs" :key="testsslJob.id" class="col-xs-12 col-sm-6">
            <div class="row cursor-pointer rounded-borders bg-white" @click="$router.push(`/${testsslJob.id}`)">
              <div class="text-weight-bold col-xs-12 col-md-6 q-pa-xs-xs q-pa-sm-sm q-pa-lg-md text-uppercase ellipsis">
                {{ parameter(testsslJob, 'target') }}
              </div>
              <div class="column items-center justify-center col-xs-6 col-md-3 q-pa-xs-xs q-pa-sm-sm q-pa-lg-md">
                <div class="text-center">
                  {{ $t('overall_grade') }}
                </div>
                <div class="q-mt-xs-xs q-mt-sm-sm q-mt-lg-md">
                  <q-avatar v-if="finding(testsslJob, 'overall_grade')" :color="gradeColor(finding(testsslJob, 'overall_grade'))" rounded size="64px" text-color="white">
                    {{ finding(testsslJob, 'overall_grade') }}
                  </q-avatar>
                  <q-skeleton v-else animation="fade" size="64px" type="rect" />
                </div>
              </div>
              <div class="column items-center justify-center col-xs-6 col-md-3 q-pa-xs-xs q-pa-sm-sm q-pa-lg-md">
                <div class="text-center">
                  {{ $t('final_score') }}
                </div>
                <div class="q-mt-xs-xs q-mt-sm-sm q-mt-lg-md">
                  <q-avatar v-if="finding(testsslJob, 'final_score')" :color="scoreColor(finding(testsslJob, 'final_score'))" rounded size="64px" text-color="white">
                    {{ finding(testsslJob, 'final_score') }}
                  </q-avatar>
                  <q-skeleton v-else animation="fade" size="64px" type="rect" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="id in [1, 2]" :key="id" class="col-xs-12 col-sm-6">
            <div class="col-xs-12 col-sm-6">
              <div class="row rounded-borders bg-white">
                <div class="col-xs-12 col-md-6 q-pa-xs-xs q-pa-sm-sm q-pa-lg-md">
                  <q-skeleton animation="fade" height="21px" type="rect" width="192px" />
                </div>
                <div class="column items-center justify-center col-xs-6 col-md-3 q-pa-xs-xs q-pa-sm-sm q-pa-lg-md">
                  <div class="text-center">
                    {{ $t('overall_grade') }}
                  </div>
                  <div class="q-mt-xs-xs q-mt-sm-sm q-mt-lg-md">
                    <q-skeleton animation="fade" size="64px" type="rect" />
                  </div>
                </div>
                <div class="column items-center justify-center col-xs-6 col-md-3 q-pa-xs-xs q-pa-sm-sm q-pa-lg-md">
                  <div class="text-center">
                    {{ $t('final_score') }}
                  </div>
                  <div class="q-mt-xs-xs q-mt-sm-sm q-mt-lg-md">
                    <q-skeleton animation="fade" size="64px" type="rect" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
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
  components: {
    Pending: () => import('components/Pending')
  },
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
