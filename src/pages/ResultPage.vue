<template>
  <q-page class="row items-center justify-evenly">
    <div class="text-center">
      <h5>Analysis Result</h5>
      <q-img src="~/assets/logo.jpg"></q-img>
      <h3>BAHAL</h3>
      <q-btn :to="{ name: 'test' }" style="width: 200px;" color="primary" size="lg" rounded outline
        class="q-mt-xl" label="Test Again"></q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ResultPage'
})
</script>
