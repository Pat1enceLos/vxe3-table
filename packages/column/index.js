import VxeTableColumn from './src/column'

VxeTableColumn.install = function (app) {
  app.component(VxeTableColumn.name, VxeTableColumn)
}

export const Column = VxeTableColumn
export default VxeTableColumn
