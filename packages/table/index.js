import VxeTable from './src/table'
import VXETable from '../v-x-e-table'

VxeTable.install = function (app) {
  VXETable.Vue = app
  VXETable.Table = VxeTable
  app.component(VxeTable.name, VxeTable)
}

export const Table = VxeTable
export default VxeTable
