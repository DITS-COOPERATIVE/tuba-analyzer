<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mb-md"> Analyzed Results </q-card>
    <q-card class="q-mb-md">
      <q-list separator bordered>
        <q-expansion-item
          class="q-pa-md"
          v-for="(value, key) in inventory.results"
          :key="key"
          v-model="value.expanded"
          :label="key"
          :caption="value.analyzed_at"
        >
          <q-expansion-item
            v-for="item of value"
            :key="item"
            v-model="item.expanded"
            :label="`TA-${item.id} (${item.status})`"
            :caption="`Purchase Date: ${item.purchase_date}`"
          >
            <div class="text-subtitle2 q-mb-sm text-center full-width">
              Test Results
            </div>
            <q-card
              bordered
              class="q-mb-md"
              v-for="test of item.tests"
              :key="test"
            >
              <div class="q-pa-md">
                <div class="q-pb-xs">
                  <b>Classification:</b>
                  {{ test.classification }}
                </div>
                <div class="q-pb-md">
                  <b>Analyzed On:</b>
                  {{ test.analyzed_on }}
                </div>
                <div class="row">
                  <div class="col-4">pH</div>
                  <div class="col-4">Turbidity</div>
                  <div class="col-4">Alcohol</div>
                  <div class="col-4">{{ test.ph }}</div>
                  <div class="col-4">{{ test.tb }}</div>
                  <div class="col-4">{{ test.al }}</div>
                </div>
              </div>
            </q-card>
            <q-btn
              v-if="item.status !== 'SOLD'"
              label="Test Again"
              color="accent"
              class="q-mr-sm"
              @click="testAgain(key, item.id, item.purchase_date)"
            ></q-btn>
            <q-btn
              v-if="item.status !== 'SOLD'"
              label="Mark as Sold"
              color="pink"
              outline
              @click="sold(key, item.id)"
            ></q-btn>
          </q-expansion-item>
        </q-expansion-item>
      </q-list>
    </q-card>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue'
import { useInventoryStore } from 'stores/inventory.store'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'InventoryPage',
  setup () {
    const inventory = useInventoryStore()
    const router = useRouter()

    function sold (key, id) {
      inventory.results[key].forEach(item => {
        if (item.id === id) {
          item.status = 'SOLD'
        }
      })

      localStorage.setItem('inventory', JSON.stringify(inventory.results))
    }

    function testAgain (key, id, purchaseDate) {
      router.push({
        name: 'test',
        query: {
          id,
          key,
          purchaseDate
        }
      })
    }

    return {
      inventory,
      sold,
      testAgain
    }
  }
})
</script>
