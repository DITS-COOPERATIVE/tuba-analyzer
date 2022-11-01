<template>
  <q-page class="row items-center justify-center q-px-md">
    <div class="text-center full-width">
      <h5>Sensors</h5>
      <div class="row justify-evenly q-mb-lg">
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="ph"
            track-size="16px"
            :min="0"
            :max="50"
            color="deep-orange"
            vertical
            reverse
            label-always
          />
          PH
        </div>
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="turbidity"
            track-size="16px"
            :min="0"
            :max="50"
            color="primary"
            vertical
            reverse
            label-always
          />
          Turbidity
        </div>
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="acidity"
            track-size="16px"
            :min="0"
            :max="50"
            color="purple"
            vertical
            reverse
            label-always
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TestPage',
  setup () {
    const analyzing = ref(false)
    const router = useRouter()
    function analyze (): void {
      analyzing.value = true
      setTimeout(() => {
        analyzing.value = false
        router.push({
          name: 'result'
        })
      }, 3000)
    }
    return {
      ph: ref(0),
      turbidity: ref(0),
      acidity: ref(0),
      analyzing,
      analyze
    }
  }
})
</script>
