<template>
  <q-page class="row items-center justify-center q-px-md">
    <div class="text-center full-width">
      <h5>Sensors</h5>
      <div class="row justify-evenly q-mb-lg">
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="resultStore.ph"
            track-size="16px"
            :min="2"
            :max="6"
            color="deep-orange"
            vertical
            reverse
            label-always
            snap
            readonly
          />
          PH
        </div>
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="resultStore.turbidity"
            track-size="16px"
            :min="0"
            :max="3"
            color="primary"
            vertical
            reverse
            label-always
            readonly
          />
          Turbidity
        </div>
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="resultStore.acidity"
            :min="563"
            :max="725"
            track-size="16px"
            color="purple"
            vertical
            reverse
            label-always
            snap
            readonly
          />
          Acidity
        </div>
      </div>

      <q-btn :loading="analyzing" @click="analyze()" style="width: 200px">
        Analyze
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Analyzing...
        </template>
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResultStore } from 'src/stores/result.store'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'TestPage',
  setup () {
    const analyzing = ref(false)
    const router = useRouter()
    const resultStore = useResultStore()

    var interval: NodeJS.Timeout

    function analyze (): void {
      analyzing.value = true
      clearInterval(interval)

      api
        .post('/process', {
          ph: resultStore.ph,
          av: resultStore.acidity,
          tb: resultStore.turbidity
        })
        .then(({ data }) => {
          resultStore.result = data
          router.push({
            name: 'result'
          })
        })
        .finally(() => {
          analyzing.value = false
        })
    }

    // function between (x: number, min: number, max: number) {
    //   return x >= min && x <= max
    // }

    // function process () {
    //   if (
    //     between(resultStore.ph, 2.62, 4.03) &&
    //     between(resultStore.turbidity, 0.59, 2.1) &&
    //     between(resultStore.acidity, 563, 690)
    //   ) {
    //     resultStore.result = 'COCONUT VINEGAR'
    //   } else if (
    //     between(resultStore.ph, 4.51, 5.08) &&
    //     between(resultStore.turbidity, 1.62, 2.08) &&
    //     between(resultStore.acidity, 699, 725)
    //   ) {
    //     resultStore.result = 'BAHAL'
    //   } else if (
    //     between(resultStore.ph, 4, 4.32) &&
    //     between(resultStore.turbidity, 1.73, 2.11) &&
    //     between(resultStore.acidity, 663, 693)
    //   ) {
    //     resultStore.result = 'BAHALINA'
    //   } else {
    //     resultStore.result = 'OUT OF SCOPE'
    //   }
    // }

    function randomNumber (min: number, max: number) {
      const rand = Math.random() * (max - min) + min

      return Math.round((rand + Number.EPSILON) * 100) / 100
    }

    onMounted(() => {
      interval = setInterval(() => {
        api
          .get('/sensors')
          .then(({ data }) => {
            console.log(data)
          })
          .catch(() => {
            resultStore.ph = randomNumber(2.62, 5.08)
            resultStore.turbidity = randomNumber(0.59, 2.11)
            resultStore.acidity = randomNumber(563, 725)
          })
      }, 1000)
    })

    return {
      resultStore,
      analyzing,
      analyze
    }
  }
})
</script>
