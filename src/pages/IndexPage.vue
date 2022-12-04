<template>
  <q-page class="row items-center justify-evenly">
    <div class="text-center">
      <h5>Tuba Analyzer App</h5>
      <q-img src="~/assets/logo.png"></q-img>
      <q-btn :to="{ name: 'test' }" style="width: 200px;" color="primary" size="lg" rounded outline
        class="q-mt-xl" label="Start"></q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
