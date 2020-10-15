import VxeTableBody from './src/body'

VxeTableBody.install = function (app) {
  app.component(VxeTableBody.name, VxeTableBody)
}

export const Body = VxeTableBody
export default VxeTableBody
