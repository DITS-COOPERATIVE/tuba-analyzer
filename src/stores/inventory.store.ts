import { defineStore } from 'pinia'

export interface Result {
  analyzed_at: string
  label: string
  purchase_from: string
  type: string
  id: string
  expanded?: boolean
  sensors?: {
    ph: string
    tb: string
    al: string
  }
  status?: string
}

export interface ScanData {
  classification: string
  analyzed_on: string
  ph: string
  tb: string
  al: string
}
export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    results: JSON.parse(localStorage.getItem('inventory') as string) || {}
  }),
  actions: {
    add (result: Result) {
      if (!this.results) {
        localStorage.setItem('inventory', '{}')
      }
      let resultData = this.results[result.purchase_from]
      if (resultData) {
        const exists = resultData.some(
          (item: { id: string }) => parseInt(item.id) === parseInt(result.id)
        )

        if (!exists) {
          resultData.push({
            expanded: false,
            label: result.label,
            id: result.id,
            status: result.status,
            tests: [
              {
                classification: result.type,
                analyzed_on: new Date().toDateString(),
                ph: result.sensors?.ph,
                tb: result.sensors?.tb,
                al: result.sensors?.al
              }
            ]
          })
          localStorage.setItem('total-item', result.id)
        } else {
          resultData.forEach(
            (item: { id: string; label: string; tests: ScanData[] }) => {
              if (parseInt(item.id) === parseInt(result.id)) {
                item.label = result.label
                item.tests.push({
                  classification: result.type,
                  analyzed_on: new Date().toDateString(),
                  ph: result.sensors?.ph as string,
                  tb: result.sensors?.tb as string,
                  al: result.sensors?.al as string
                })
              }
            }
          )
        }
        this.results[result.purchase_from] = resultData
        resultData = this.results[result.purchase_from]
      } else {
        this.results[result.purchase_from] = [
          {
            expanded: false,
            label: result.label,
            id: result.id,
            status: result.status,
            tests: [
              {
                classification: result.type,
                analyzed_on: new Date().toDateString(),
                ph: result.sensors?.ph,
                tb: result.sensors?.tb,
                al: result.sensors?.al
              }
            ]
          }
        ]
        resultData = this.results
        localStorage.setItem('total-item', result.id)
      }

      console.log(resultData)

      localStorage.setItem('inventory', JSON.stringify(resultData))
    }
  }
})
