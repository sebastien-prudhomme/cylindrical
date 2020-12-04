<template>
  <q-page class="q-pa-xs-sm q-pa-sm-md q-pa-lg-lg">
    <div v-if="!testsslJobError">
      <div class="rounded-borders bg-white">
        <div class="q-pa-xs-sm q-pa-sm-md q-pa-lg-lg">
          <div v-if="testsslJob" class="text-h4 text-weight-bold text-center text-uppercase ellipsis">
            {{ parameter('target') }}
          </div>
          <q-skeleton v-else animation="fade" class="text-h4" type="rect" />
        </div>
        <div class="row">
          <div class="column items-center justify-center col-xs-12 col-sm-6 col-md-3 q-pa-xs-sm q-pa-sm-md q-pa-lg-lg">
            <div class="text-h4 text-center">
              {{ $t('overall_grade') }}
            </div>
            <div class="q-mt-xs-sm q-mt-sm-md q-mt-lg-lg">
              <q-avatar v-if="finding('overall_grade')" :color="gradeColor(finding('overall_grade'))" rounded size="128px" text-color="white">
                {{ finding('overall_grade') }}
              </q-avatar>
              <q-skeleton v-else animation="fade" size="128px" type="rect" />
            </div>
          </div>
          <div class="column items-center justify-center col-xs-12 col-sm-6 col-md-3 q-pa-xs-sm q-pa-sm-md q-pa-lg-lg">
            <div class="text-h4 text-center">
              {{ $t('final_score') }}
            </div>
            <div class="q-mt-xs-sm q-mt-sm-md q-mt-lg-lg">
              <q-avatar v-if="finding('final_score')" :color="scoreColor(finding('final_score'))" rounded size="128px" text-color="white">
                {{ finding('final_score') }}
              </q-avatar>
              <q-skeleton v-else animation="fade" size="128px" type="rect" />
            </div>
          </div>
          <apexchart class="col-xs-12 col-md-6 q-pa-xs-sm q-pa-sm-md q-pa-lg-lg" height="256px" :options="graphOptions" :series="graphSeries" />
        </div>
      </div>
      <pre v-if="html" class="overflow-auto q-mt-xs-sm q-mt-sm-md q-mt-lg-lg q-mb-none q-pa-xs-sm q-pa-sm-md q-pa-lg-lg text-white rounded-borders bg-blue-grey-10" v-html="html" />
    </div>
    <div v-if="testsslJobError" class="q-pa-xs-sm q-pa-sm-md q-pa-lg-lg text-negative rounded-borders bg-red-2">
      <q-icon left name="warning" size="md" />
      {{ testsslJobError.message }}
    </div>
  </q-page>
</template>

<script>
import AnsiToHtml from 'ansi-to-html'
import { makeGetMixin } from 'feathers-vuex'
import { partial } from 'lodash'
import { jobArtifactHelper, jobFindingHelper, jobGradeColorHelper, jobParameterHelper, jobScoreColorHelper } from '../helpers/job'

export default {
  name: 'Job',
  components: {
    Apexchart: () => import('vue-apexcharts')
  },
  mixins: [makeGetMixin({
    service: 'testssl-jobs',
    id () { return this.$route.params.id }
  })],
  data () {
    return {
      graphOptions: {
        chart: {
          toolbar: {
            show: false
          },
          type: 'bar'
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: 0,
                  to: 50,
                  color: '#c62828' // negative
                },
                {
                  from: 50,
                  to: 80,
                  color: '#fbc02d' // warning
                },
                {
                  from: 80,
                  to: 100,
                  color: '#2e7d32' // positive
                }
              ]
            },
            horizontal: true
          }
        },
        xaxis: {
          axisBorder: {
            show: false
          },
          categories: [
            this.$t('protocol_support'),
            this.$t('key_exchange'),
            this.$t('cipher_strength')
          ],
          min: 0,
          max: 100,
          tickAmount: 5
        }
      }
    }
  },
  computed: {
    artifact: function () {
      return partial(jobArtifactHelper, this.testsslJob)
    },
    finding: function () {
      return partial(jobFindingHelper, this.testsslJob)
    },
    gradeColor () {
      return jobGradeColorHelper
    },
    graphSeries () {
      const protocolSupportScore = this.finding('protocol_support_score')
      const keyExchangeScore = this.finding('key_exchange_score')
      const cipherStrengthScore = this.finding('cipher_strength_score')

      return [
        {
          data: [
            protocolSupportScore,
            keyExchangeScore,
            cipherStrengthScore
          ],
          name: this.$t('score')
        }
      ]
    },
    html: function () {
      const artifact = this.artifact('log')

      if (artifact) {
        const log = artifact.content
        const html = new AnsiToHtml({ newline: true }).toHtml(log)

        return html
      } else {
        return null
      }
    },
    parameter () {
      return partial(jobParameterHelper, this.testsslJob)
    },
    scoreColor () {
      return jobScoreColorHelper
    },
    testsslJobParams () {
      return { $populateParams: { name: 'withArtifacts' } }
    }
  }
}
</script>
