import VxeToolbar from './src/toolbar'

VxeToolbar.install = function (app) {
  app.component(VxeToolbar.name, VxeToolbar)
}

export const Toolbar = VxeToolbar
export default VxeToolbar
