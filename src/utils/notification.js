import notify from 'devextreme/ui/notify'
import hideToasts from 'devextreme/ui/toast/hide_toasts'
import _ from 'lodash'
const defaultTypes = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning'
}
const defaultPositions = {
  topLeft: 'top left',
  topMiddle: 'top center',
  topRight: 'top right',
  centerLeft: 'left center',
  centerMiddle: 'center',
  centerRight: 'right center',
  bottomLeft: 'bottom left',
  bottomMiddle: 'bottom center',
  bottomRight: 'bottom right'
}
const optionsDefault = () => ({
  type: 'error',
  width: '250'
})
const stackDefault = () => ({
  position: {
    top: 50,
    right: 5
  }
})
export default class notification {
  static type = defaultTypes
  static position = defaultPositions
  static withOptions(notificationOptions) {
    const defaultOptions = optionsDefault()
    const stackOptions = stackDefault()
    _.merge(defaultOptions, notificationOptions)
    notify(defaultOptions, stackOptions)
  }
  static withOptionsAndStack(notificationOptions, notificationStack) {
    const defaultOptions = optionsDefault()
    const stackOptions = stackDefault()
    _.merge(defaultOptions, notificationOptions)
    _.merge(stackOptions, notificationStack)
    notify(defaultOptions, stackOptions)
  }
  static hideAll() {
    hideToasts()
  }
}
