import { defineComponent, h, resolveComponent } from 'vue';
import Test from './test';

// const HelloWorld = {
//   name: 'HelloWorld',
//   props: {
//     msg: String,
//   },
//   setup(props: any) {
//     // console.log(props);
//     // @ts-ignore
//     return () => h(resolveComponent('test'), { msg: '123' })
//   },
// };

const HelloWorld = defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
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
    handlePageChange({
      currentPage,
      pageSize,
    }: any) {
      if (!this.tablePage) return;
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
    },
    git(t: string) {
      console.log(t)
    }
  },
  render() {
    return (
      <div style="width: calc(100% - 40px);position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);height: calc(100vh - 128px);display: flex;flex-direction: column">
        <vxe-table editConfig={{trigger: 'dblclick', mode: 'cell'}} data={this.tableData} highlight-hover-row show-header-overflow header-align="left">
          <vxe-table-column resizable field="name" title="Name" show-header-overflow show-overflow></vxe-table-column>
          <vxe-table-column resizable field="sex" title="Sex" show-header-overflow show-overflow></vxe-table-column>
          <vxe-table-column edit-render={{name: 'input', immediate: true, attrs: {type: 'text'}}} resizable field="address" title="Address" show-header-overflow show-overflow></vxe-table-column>
          <vxe-table-column title="" resizable={false} showOverflow={false}></vxe-table-column>
        </vxe-table>
        <vxe-pager
          border
          size="medium"
          currentPage={this.tablePage.currentPage}
          pageSize={this.tablePage.pageSize}
          total={this.tablePage.total}
          layouts={['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']}
          pageSizes={[10, 20, 50, 100]}
          style="margin: 36px 0 64px 0"
          onPageChange={this.handlePageChange}
        >
        </vxe-pager>
        <test onGit={this.git}><span> 123</span></test>
        <vxe-button onClick={() => console.log(123)} age='13'>345345646</vxe-button>
      </div>
    );
  }
})

// @ts-ignore
HelloWorld.install = (app) => {
  app.component('HelloWorld', HelloWorld);
}

export default HelloWorld;