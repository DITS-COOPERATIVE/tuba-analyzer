<template>
  <q-page class="row items-center justify-center q-px-md">
    <div class="text-center full-width">
      <h3>Sensors</h3>
      <div class="row justify-evenly q-mb-lg">
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="resultStore.ph"
            track-size="16px"
            :max="10"
            color="deep-orange"
            vertical
            reverse
            label-always
            snap
            readonly
            :step="0.01"
          />
          pH
        </div>
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="resultStore.turbidity"
            track-size="16px"
            :max="10"
            color="primary"
            vertical
            reverse
            label-always
            readonly
            :step="0.1"
          />
          Turbidity
        </div>
        <div class="column justify-between" style="height: 250px">
          <q-slider
            v-model="resultStore.acidity"
            :max="1000"
            track-size="16px"
            color="purple"
            vertical
            reverse
            label-always
            snap
            readonly
          />
          Alcohol
        </div>
      </div>
      <q-btn
        v-if="!connected"
        color="primary"
        outline
        class="q-mt-md"
        @click="scanDevices"
        style="width: 300px"
      >
        Scan Devices
      </q-btn>
      <q-btn
        v-else
        color="primary"
        outline
        class="q-mt-md"
        @click="previewScan()"
        style="width: 300px"
      >
        Analyze
      </q-btn>
      <q-btn
        v-if="connected"
        color="negative"
        outline
        class="q-mt-md"
        @click="disconnect"
        style="width: 300px"
      >
        Disconnect
      </q-btn>
    </div>
    <q-dialog v-model="openScan">
      <q-card style="width: 264px" class="q-pb-md">
        <q-list>
          <q-item-label header>List of Paired Devices</q-item-label>
          <q-item
            clickable
            v-for="device in devices"
            :key="device.id"
            @click="connect(device)"
          >
            <q-item-section>
              {{ device.name }}
            </q-item-section>
            <q-item-section side>
              <q-icon name="cast"></q-icon>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
    <q-dialog v-model="previewAnalyze" @hide="cancel">
      <q-card style="width: 304px" class="q-pa-md q-gutter-sm">
        <div class="text-subtitle2">Scan Other Data</div>

        <q-input
          v-model="scanData.purchase_from"
          label="Purchase From"
          outlined
          :readonly="fromInventory"
        />
        <q-input v-model="scanData.purchase_date" label="Purchase Date" mask="date" :rules="['date']" outlined>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="scanData.purchase_date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-btn
          label="Continue"
          class="full-width"
          color="primary"
          :disable="!scanData.purchase_date || !scanData.purchase_from"
          :loading="analyzing"
          @click="analyze()"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Analyzing...
          </template>
        </q-btn>
      </q-card>
    </q-dialog>
    <q-inner-loading
      :showing="connecting"
      label="Trying to connect..."
      label-class="text-primary"
      label-style="font-size: 1.1em"
    />
    <q-inner-loading
      :showing="disconnecting"
      label="Trying to disconnect..."
      label-class="text-negative"
      label-style="font-size: 1.1em"
    />
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResultStore } from 'src/stores/result.store'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useInventoryStore } from 'src/stores/inventory.store'

const bluetooth = window.bluetoothSerial
export default defineComponent({
  name: 'TestPage',
  setup () {
    const route = useRoute()
    const inventory = useInventoryStore()
    const $q = useQuasar()
    const analyzing = ref(false)
    const router = useRouter()
    const resultStore = useResultStore()
    const enable = ref(true)
    const connected = ref(true)
    const openScan = ref(false)
    const devices = ref([])
    const connecting = ref(false)
    const disconnecting = ref(false)
    const previewAnalyze = ref(false)
    const scanData = ref({
      analyzed_at: '',
      purchase_date: '',
      purchase_from: '',
      type: '',
      id: null
    })

    const fromInventory = ref(false)

    function analyze () {
      analyzing.value = true

      api
        .post('/process', {
          ph: resultStore.ph,
          av: resultStore.acidity,
          tb: resultStore.turbidity
        })
        .then(({ data }) => {
          resultStore.result = data
          inventory.add({
            analyzed_at: new Date().toDateString(),
            purchase_from: scanData.value.purchase_from,
            type: data,
            id: scanData.value.id
              ? scanData.value.id
              : parseInt(localStorage.getItem('total-item') || '0') + 1,
            purchase_date: scanData.value.purchase_date,
            status: 'STOCK',
            sensors: {
              ph: resultStore.ph,
              tb: resultStore.turbidity,
              al: resultStore.acidity
            }
          })
          router.push({
            name: 'result'
          })
          bluetooth.unsubscribeRawData()
        })
        .finally(() => {
          analyzing.value = false
        })
    }

    function scanDevices () {
      openScan.value = true
      bluetooth.list(devicesPaired => {
        devices.value = devicesPaired
      })
    }

    function subscribe () {
      bluetooth.subscribeRawData(data => {
        const enc = new TextDecoder('utf-8')
        console.log('DECODE DATA', enc.decode(data))
        const outputs = enc.decode(data).split(',')
        console.log('SPLIT DATA', outputs)

        if (outputs[0] && outputs[1] && outputs[2]) {
          if (outputs[0] && !isNaN(outputs[0])) {
            console.log('DATA PH: ', outputs[0])
            resultStore.ph = parseFloat(outputs[0])
          }

          if (outputs[1] && !isNaN(outputs[1])) {
            console.log('DATA TB ', outputs[1])
            resultStore.turbidity = parseFloat(outputs[1])
          }

          if (outputs[2] && !isNaN(outputs[2])) {
            console.log('DATA AL', outputs[2])
            resultStore.acidity = parseFloat(outputs[2])
          }
        }
      })
    }

    function connect (device) {
      openScan.value = false
      console.log('TRY TO CONNECT')
      connecting.value = true
      bluetooth.connect(
        device.id,
        () => {
          connected.value = true
          connecting.value = false
          $q.notify({
            message: 'Bluetooth connected successfully.',
            type: 'positive',
            position: 'top'
          })
          console.log('CONNECTED')
          subscribe()
        },
        () => {
          connected.value = false
          connecting.value = false
          $q.notify({
            message: 'Failed to connect. Try again!',
            type: 'negative',
            position: 'top'
          })
        }
      )
    }

    function disconnect () {
      disconnecting.value = true
      bluetooth.disconnect(() => {
        disconnecting.value = false
        connected.value = false
        $q.notify({
          message: 'Bluetooth disconnect successfully.',
          type: 'positive',
          position: 'top'
        })
      })
    }

    function previewScan () {
      previewAnalyze.value = true
      bluetooth.unsubscribeRawData()
    }

    function cancel () {
      previewAnalyze.value = false
      subscribe()
    }

    onMounted(() => {
      bluetooth.enable(
        () => {
          enable.value = true
        },
        () => {
          enable.value = false
        }
      )

      bluetooth.isConnected(
        () => {
          connected.value = true
          subscribe()
        },
        () => {
          connected.value = false
        }
      )

      if (Object.keys(route.query).length > 0) {
        fromInventory.value = true
        scanData.value.id = route.query.id
        scanData.value.purchase_from = route.query.key
        scanData.value.purchase_date = route.query.purchaseDate
      }
    })

    return {
      resultStore,
      analyzing,
      analyze,
      scanDevices,
      enable,
      openScan,
      devices,
      connect,
      connected,
      connecting,
      disconnecting,
      disconnect,
      previewAnalyze,
      previewScan,
      scanData,
      fromInventory,
      cancel
    }
  }
})
</script>
