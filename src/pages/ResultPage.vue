<template>
  <q-page class="row items-center justify-evenly">
    <div class="text-center" style="width: 90%">
      <h5>Analysis Result</h5>
      <q-img
        class="q-mb-lg"
        src="~/assets/logo.png"
        style="width: 200px; heigth: 200px"
      ></q-img>
      <div class="text-h3 q-my-md">{{ resultStore.result }}</div>
      <div
        class="flex justify-evenly shadow-3 full-width q-py-md q-px-none rounded-borders"
      >
        <div class="text-subtitle2"><b> PH:</b> {{ resultStore.ph }}</div>
        <div><b>Turbidity: </b> {{ resultStore.turbidity }}</div>
        <div><b>Acidity: </b> {{ resultStore.acidity }}</div>
      </div>
      <q-btn
        :to="{ name: 'test' }"
        style="width: 200px"
        color="primary"
        size="lg"
        rounded
        outline
        class="q-mt-xl"
        label="Test Again"
      ></q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useResultStore } from 'src/stores/result.store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ResultPage',
  setup () {
    const resultStore = useResultStore()

    return {
      resultStore
    }
  }
})
</script>
