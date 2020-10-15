import VxeSelect from './src/select'
import VxeOption from './src/option'
import VxeOptgroup from './src/optgroup'

VxeSelect.install = function (app) {
  app.component(VxeSelect.name, VxeSelect)
  app.component(VxeOption.name, VxeOption)
  app.component(VxeOptgroup.name, VxeOptgroup)
}

export const Select = VxeSelect
export default VxeSelect
