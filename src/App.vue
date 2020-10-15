<template>
  <!-- <hello-world msg="Welcome to Your Vue.js + TypeScript App"/> -->
  <div style="width: calc(100% - 40px);position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);height: calc(100vh - 128px);display: flex;flex-direction: column">
    <vxe-table @checkboxChange="tt" :editConfig="{trigger: 'dblclick', mode: 'cell'}" :data="tableData" highlight-hover-row show-header-overflow header-align="left">
      <vxe-table-column type="checkbox" title="" :resizable="false" show-overflow align="center"></vxe-table-column>
      <vxe-table-column resizable field="name" title="Name" show-header-overflow show-overflow></vxe-table-column>
      <vxe-table-column resizable field="sex" title="Sex" show-header-overflow show-overflow></vxe-table-column>
      <vxe-table-column :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}" resizable field="address" title="Address" show-header-overflow show-overflow>
          <button>
            删除草稿
          </button>
      </vxe-table-column>
      <vxe-table-column title="" :resizable="false" :showOverflow="false"></vxe-table-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :currentPage="tablePage.currentPage"
      :pageSize="tablePage.pageSize"
      :total="tablePage.total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      :pageSizes="[10, 20, 50, 100]"
      style="margin: 36px 0 64px 0"
      @pageChange="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld';

export default defineComponent({
  name: 'App',
  data() {
    return {
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        total: 121
      },
      tableData: [
        {
          id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', address: 'Shenzhen',
        },
        {
          id: 10002, name: 'Test2', role: 'Test', sex: 'Man', address: 'Guangzhou',
        },
        {
          id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai',
        },
      ],
    };
  },
  methods: {
    tt() {
      console.log(143)
    },
    handlePageChange({
      currentPage,
      pageSize,
    }: any) {
      if (!this.tablePage) return;
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
