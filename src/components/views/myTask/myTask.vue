<template>
  <div class="myTaskContent">
    <div class="taskTable">
      <el-table
        :header-cell-style="tableHeaderColor"
        :cell-style="tableRowStyle"
        border
        v-show='toggleCurrentOrHistory==="current"'
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="240"
        >
        </el-table-column>
        <el-table-column
          label="任务名"
          prop="jobName"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="标注类型"
          prop="remarkTypeName"
          width="140"
        >
        </el-table-column>
        <el-table-column
          label="任务类型"
          prop="jobTypeName"
          width="140"
        >
        </el-table-column>
        <el-table-column
          label="当前任务状态" width="*">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">去完成
            </el-button>
            <!--            <el-button-->
            <!--              size="mini"-->
            <!--              type="danger"-->
            <!--              @click="handleDelete(scope.$index, scope.row)">完成-->
            <!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show='toggleCurrentOrHistory==="current"'
        style="float: right;margin-top: 10px;"
        background
        layout="sizes, prev, pager, next"
        @current-change="curPageChange"
        :page-size="curPageSize"
        @size-change="curhandleSizeChange"
        :page-sizes="[10, 15, 20, 25, 30]"
        :total="curTotalPages">
      </el-pagination>

      <el-table
        :header-cell-style="tableHeaderColor"
        border
        :cell-style="tableRowStyle"
        v-show='toggleCurrentOrHistory==="history"'
        :data="hisTableData"
        style="width: 100%">
        <el-table-column
          label="完成时间"
          prop="updateTime"
          width="240"
        >
        </el-table-column>
        <el-table-column
          label="任务名"
          prop="jobName"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="标注类型"
          prop="remarkTypeName"
          width="140"
        >
        </el-table-column>
        <el-table-column
          label="任务类型"
          prop="jobTypeName"
          width="140"
        >
        </el-table-column>
        <el-table-column
          label="历史任务状态"
          width="*"
        >
          <!-- <template slot="header" slot-scope="scope">
              <el-input
              v-model="search"
              size="mini"
              prefix-icon="el-icon-search"
              placeholder="输入关键字搜索"/>
          </template> -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              >已完成
            </el-button>
            <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">完成</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show='toggleCurrentOrHistory==="history"'
        style="float: right;margin-top: 10px;"
        background
        @current-change="hisPageChange"
        @size-change="hishandleSizeChange"
        :page-sizes="[10, 15, 20, 25, 30]"
        :page-size="hisPageSize"
        layout="sizes, prev, pager, next"
        :total="hisTotalPages">
      </el-pagination>
      <div class="taggleBtn">
        <el-button type="primary" size="small" @click="toggleSelection()">{{toggleCurrentOrHistory === 'current' ?
          '切换为历史任务列表' : '切换为当前任务列表'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  // import hht from '../markTool/markTool'
  export default {
    data () {
      return {
        imageListPageIndex: 1,
        curPageSize: 10,
        hisPageSize: 10,
        curPageIndex: 1,
        hisPageIndex: 1,
        curTotalPages: 0,
        hisTotalPages: 0,
        toggleCurrentOrHistory: 'current',
        tableData: [],
        hisTableData: [],
        search: '',
        myWorkNavColor: '2'
      }
    },
    mounted () {
      this.getTableDaTa()
      this.getHisTableData()
    },
    // computed: {
    //   role() {
    //     return this.$store.state.auth.limitsOfauthority;
    //   }
    // },
    methods: {
      // 当前页数
      curPageChange (val) {
        this.curPageIndex = val
        this.getTableDaTa()
      },
      curhandleSizeChange (val) {
        this.curPageSize = val
        this.getTableDaTa()
      },
      // 当前页数
      hisPageChange (val) {
        this.hisPageIndex = val
        this.getHisTableData()
      },
      hishandleSizeChange (val) {
        this.hisPageSize = val
        this.getHisTableData()
      },
      // 初始化 未完成任务
      getTableDaTa () {
        let params = {
          pageIndex: this.curPageIndex,
          pageSize: this.curPageSize,
          users: this.userid,
          status: 0
        }
        const this_ = this
        this.$axios({
          method: 'post',
          url: '/job/getJobList',
          data: params
        }).then((res) => {
          if (res.status == 200) {
            // console.log('res===++--===', res.data)
            const jobs = res.data.jobs
            this_.curTotalPages = jobs.total
            this_.tableData = jobs.list
          } else {
            this.$message({
              type: 'error',
              message: '请求异常：' + res.statusText
            })
          }
        })
          .catch((err) => {
            // console.log('err==',err)
          })
      },
      // 初始化 已完成任务
      getHisTableData () {
        let params = {
          pageIndex: this.hisPageIndex,
          pageSize: this.hisPageSize,
          users: this.userid,
          status: 1
        }
        const this_ = this
        this.$axios({
          method: 'post',
          url: '/job/getJobList',
          data: params
        }).then((res) => {
          if (res.status == 200) {
            // console.log('res===++--===', res.data)
            const jobs = res.data.jobs
            this_.hisTotalPages = jobs.total
            this_.hisTableData = jobs.list
          } else {
            this.$message({
              type: 'error',
              message: '请求异常：' + res.statusText
            })
          }

        }).catch((err) => {
          // console.log('err==',err)
        })
      },
      tableHeaderColor ({row, column, rowIndex, columnIndex}) {
        return 'font-size:16px;text-align:center'
      },
      tableRowStyle ({row, rowIndex}) {
        return 'text-align:center'
      },
      handleEdit (index, row) {
        // console.log('index,row', index,'-----',row)
        // if (row.jobType === '2') {
          let params = {
          "jobID": row.id,
          "jobType": row.jobType,
          "pageIndex": 1,
          "pageSize": 1,
          "user": this.userid,
          }
          this.$axios({ //请求未标注的第一张图片index
            method: 'post',
            url: '/job/getFirstBase64Images',
            data: params
          })
          .then(res => {
            // console.log('resfrist=-=-=-=', res)
            this.imageListPageIndex = res.data.index + 1
            // console.log('this.imageListPageIndex=-=-=-=', this.imageListPageIndex)
            this.$router.push({
              path: '/home/myWork',
              query: {data: row, pageIndex: this.imageListPageIndex}
            })
          })
        // }else{
        //   this.$router.push({
        //     path: '/home/myWork',
        //     query: {data: row, pageIndex: this.imageListPageIndex}
        //   })
        // }
        
      },
      handleDelete (index, row) {
      },
      toggleSelection () {
        if (this.toggleCurrentOrHistory === 'current') {
          this.getHisTableData()
          this.toggleCurrentOrHistory = 'history'
        } else {
          this.getTableDaTa()
          this.toggleCurrentOrHistory = 'current'
        }
      }
    },
    created: function () {
      this.getTableDaTa()
    },
    computed: {
      username: function () {
        return this.$store.state.auth.loginName
      },
      userid: function () {
        return this.$store.state.auth.userid
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus">
  .myTaskContent
    padding-top: 10px

    .taskTable
      border: 1px solid #d4d4d4
      border-radius: 8px
      width: 71%
      padding: 5px 15px 10px
      margin: 0 auto

      .taggleBtn
        margin-top: 10px
        display: flex
        justify-content: flex-end
</style>

