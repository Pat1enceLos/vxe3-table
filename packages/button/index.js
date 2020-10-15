import VxeButton from './src/button'

VxeButton.install = function (app) {
  app.component(VxeButton.name, VxeButton)
}

export const Button = VxeButton
export default VxeButton
