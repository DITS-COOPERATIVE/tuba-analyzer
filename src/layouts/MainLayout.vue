<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer v-if="route.name !== 'home'">
      <q-tabs  v-model="tab" inline-label class="bg-pink text-white shadow-2">
        <q-route-tab icon="sensors" to="/test-page" />
        <q-route-tab icon="inventory" to="/inventory" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const tab = ref('')
    const route = useRoute()

    return {
      tab,
      route
    }
  }
})
</script>
