import VxeInput from './src/input'

VxeInput.install = function (app) {
  app.component(VxeInput.name, VxeInput)
}

export const Input = VxeInput
export default VxeInput
