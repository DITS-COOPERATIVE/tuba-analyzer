<template>
  <q-page>
    <div
      class="absolute fit column flex-center no-wrap"
    >
      <div class="column flex-center">
        <q-icon
          name="fab fa-bluetooth"
          :color="bleEnable ? 'primary' : 'gray'"
          size="lg"
          class="q-ma-md"
        />
        Bluetooth is {{ bleEnable ? 'Active' : 'Inactive' }}

        <q-btn
          :label="scanning ? 'Scanning...' : 'Start Scanning'"
          color="primary"
          :loading="scanning"
          :disable="!bleEnable"
          class="q-ma-md"
          @click="scan"
        />
      </div>

      <div class="scroll">
        <q-list
          v-if="results.length"
          bordered
          separator
          class="rounded-borders"
        >
          <Result
            v-for="result in filtered_results"
            :key="result.device.deviceId"
            :result="result"
          />
        </q-list>
        <span
          v-else-if="!scanning && triedScanning"
          class="q-ma-lg text-subtitle1"
          >No devices found. Try again later!</span
        >
      </div>
      <q-btn
        v-if="results.length"
        :label="seeAll ? 'Hide Unknown Devices' : 'See All'"
        flat
        color="primary"
        @click="seeAll = !seeAll"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Result from 'src/components/ResultComponent.vue'
import {
  BleClient,
  ScanResult
} from '../../src-capacitor/node_modules/@capacitor-community/bluetooth-le'

export default defineComponent({
  components: { Result },
  computed: {
    filtered_results (): ScanResult[] {
      if (this.seeAll) return this.results
      else return this.results.filter(result => result.localName)
    }
  },
  setup () {
    const results = ref<ScanResult[]>([])
    const scanning = ref(false)
    const triedScanning = ref(false)
    const bleEnable = ref(false)
    const seeAll = ref(false)
    const error = ref('')

    const init = async () => {
      try {
        await BleClient.initialize({
          androidNeverForLocation: true
        })

        bleEnable.value = await BleClient.isEnabled()

        await BleClient.startEnabledNotifications((enabled: boolean) => {
          bleEnable.value = enabled
        })
      } catch (err) {
        alert(err)
        error.value = (err as Error).message
      }
    }

    const scan = async () => {
      results.value = []
      scanning.value = true
      triedScanning.value = true

      try {
        await BleClient.requestLEScan({}, result => {
          results.value.push(result)
        })

        setTimeout(() => {
          void BleClient.stopLEScan().then(() => {
            scanning.value = false
          })
        }, 10000)
      } catch (err) {
        error.value = (err as Error).message
      }
    }

    onMounted(init)

    return {
      results,
      scanning,
      triedScanning,
      bleEnable,
      seeAll,
      error,
      scan
    }
  }
})
</script>
