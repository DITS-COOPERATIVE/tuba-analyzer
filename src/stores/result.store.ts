import { defineStore } from 'pinia'

export const useResultStore = defineStore('result', {
  state: () => ({
    ph: 0,
    acidity: 0,
    turbidity: 0,
    result: 'BAHAL'
  })
})
