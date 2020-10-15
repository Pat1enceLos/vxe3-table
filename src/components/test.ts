import { defineComponent, h } from 'vue';

const Test = defineComponent({
  name: 'Test',
  props: {
    msg: String,
    onGit: Function,
  },
  mounted() {
    setTimeout(() => {
      this.$emit('git', 'test')
    }, 2000);
  },
  render() {
    return h('div',
      () => this.$slots.default
    )
  }
});

// @ts-ignore
Test.install = (app) => {
  app.component('Test', Test);
}
export default Test;