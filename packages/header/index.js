import VxeTableHeader from './src/header'

VxeTableHeader.install = function (app) {
  app.component(VxeTableHeader.name, VxeTableHeader)
}

export const Header = VxeTableHeader
export default VxeTableHeader
