import { h } from 'vue';
import { getOptUniqueId } from './util'
import { UtilTools } from '../../tools'

export default {
  name: 'VxeOptgroup',
  props: {
    label: { type: [String, Number, Boolean], default: '' },
    disabled: Boolean,
    size: String
  },
  provide () {
    return {
      $xeoptgroup: this
    }
  },
  inject: {
    $xeselect: {
      default: null
    }
  },
  data () {
    return {
      id: getOptUniqueId()
    }
  },
  computed: {
    vSize () {
      return this.size || this.$parent.size || this.$parent.vSize
    }
  },
  render () {
    return h('div', {
      class: ['vxe-optgroup', {
        'is--disabled': this.disabled
      }],
      'data-optid': this.id
    }, [
      h('div', {
        class: 'vxe-optgroup--title'
      }, UtilTools.getFuncText(this.label)),
      h('div', {
        class: 'vxe-optgroup--wrapper'
      }, this.$slots.default())
    ])
  }
}
