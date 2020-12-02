<template>
  <q-page padding>
    <div v-if="!testsslJobError">
      <div class="rounded-borders bg-white">
        <div class="text-h4 text-weight-bold q-pa-md text-center text-uppercase ellipsis">
          {{ parameter('target') }}
        </div>
        <div class="row">
          <div class="column items-center justify-center col-xs-12 col-sm-6 col-md-3 q-pa-md">
            <div class="text-h4 text-center">
              {{ $t('overall_grade') }}
            </div>
            <q-avatar class="q-mt-md" :color="gradeColor(finding('overall_grade'))" rounded size="128px" text-color="white">
              {{ finding('overall_grade') }}
            </q-avatar>
          </div>
          <div class="column items-center justify-center col-xs-12 col-sm-6 col-md-3 q-pa-md">
            <div class="text-h4 text-center">
              {{ $t('final_score') }}
            </div>
            <q-avatar class="q-mt-md" :color="scoreColor(finding('final_score'))" rounded size="128px" text-color="white">
              {{ finding('final_score') }}
            </q-avatar>
          </div>
          <apexchart class="col-xs-12 col-md-6 q-pa-md" height="256px" :options="graphOptions" :series="graphSeries" />
        </div>
      </div>
      <pre class="overflow-auto q-mt-md q-mb-none q-pa-md text-white rounded-borders bg-blue-grey-10" v-html="html" />
    </div>
    <div v-if="testsslJobError" class="q-pa-md text-negative rounded-borders bg-red-2">
      <q-icon left name="warning" size="md" />
      {{ testsslJobError.message }}
    </div>
  </q-page>
</template>

<script>
import AnsiToHtml from 'ansi-to-html'
import { makeGetMixin } from 'feathers-vuex'

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
      return function (type) {
        if (this.testsslJob && this.testsslJob.artifacts) {
          const artifactId = `${this.testsslJob.id}/output.${type}`
          const artifact = this.testsslJob.artifacts.find(artifact => artifact.id === artifactId)

          return artifact === undefined ? null : artifact
        } else {
          return null
        }
      }
    },
    finding: function () {
      return function (id) {
        const artifact = this.artifact('json')

        if (artifact) {
          const json = JSON.parse(artifact.content)
          const finding = json.find(item => item.id === id).finding

          return finding === undefined ? null : finding
        } else {
          return null
        }
      }
    },
    gradeColor () {
      return function (grade) {
        if (grade[0] === 'A') {
          return 'positive'
        } else if (grade[0] === 'B' || grade[0] === 'C') {
          return 'warning'
        } else {
          return 'negative'
        }
      }
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
      return function (name) {
        if (this.testsslJob) {
          const parameter = this.testsslJob.parameters.find(parameter => parameter.name === name)

          return parameter === undefined ? null : parameter.value
        } else {
          return null
        }
      }
    },
    scoreColor () {
      return function (score) {
        if (score >= 80) {
          return 'positive'
        } else if (score >= 50) {
          return 'warning'
        } else {
          return 'negative'
        }
      }
    },
    testsslJobParams () {
      return { $populateParams: { name: 'withArtifacts' } }
    }
  }
}
</script>
