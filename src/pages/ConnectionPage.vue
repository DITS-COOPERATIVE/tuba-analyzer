<template>
  <q-page class="row items-center justify-evenly">
    <div style="width: 300px">
      <div class="text-center q-mb-lg">
        <h5 class="q-mb-sm">
          Bluetooth
          <q-icon color="primary" name="bluetooth" />
        </h5>
        <q-toggle v-model="value" color="green" label="Turn On" left-label/>
        <q-btn   v-if="value" class="block full-width" label="Scan Devices"/>
      </div>

      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item with caption</q-item-label>
            <q-item-label caption>Caption</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>OVERLINE</q-item-label>
            <q-item-label>Item with caption</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script type="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ConnectionPage',
  setup () {
    return {
      value: ref(true)
    }
  }
})
</script>
