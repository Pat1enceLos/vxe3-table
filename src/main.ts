import { createApp } from 'vue';
import App from './App.vue';
import VXETable from '../packages/vxe-table';
import '../lib/index.css'
import Test from './components/test';
import HelloWorld from './components/HelloWorld';

const app = createApp(App);
// @ts-ignore
app.use(VXETable).use(Test).use(HelloWorld).mount('#app');
