<template>
  <div class="filesHandleContent">
    <div v-if="isShow === 'compress'">
      <compressionPackage :isShow="isShow"></compressionPackage>
    </div>
    <div v-if="isShow === 'export'">
      <el-row class="rowhandle">
        <el-col :span="8">
          <el-select v-model="searchExport" placeholder="请筛选资源集名称" size="small" clearable @change="searchScene()">
            <el-option
              v-for="item in livingList"
              :key="item.id"
              :label="item.instancename"
              :value="item.instancename">
            </el-option>
          </el-select>
        </el-col>

        <!-- <el-col :span="6">
          <el-input
              clearable
              size="small"
              placeholder="请输入资源集名查询"
              prefix-icon="el-icon-search"
              v-model="nameSearch">
              <!-- @keyup.enter.native="nameSearchEnter()" -->
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :header-cell-style="tableHeaderColor"
        :cell-style="tableRowStyle"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          label="id"
          prop="id"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="filename"
          label="下载包名"
          width="200"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="instanceName"
          label="资源集名"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="导出操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="exportResource(scope.row)">导出</el-button>
            <el-button type="text" @click="delBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="bottomRow">
        <el-col :span="12">
          <el-button type="primary" size="small" @click=" toggle()">切换为压缩
          </el-button>
          <!-- <el-button type="primary" size="small" @click=" dialogVisible = true">导出
          </el-button>
          <el-button type="primary" size="small" @click=" dialogVisibleAll = true">全部导出
          </el-button> -->
        </el-col>
        <el-col :span="12">
          <el-pagination
            style="float: right;"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync=currentPages
            :page-sizes="[10, 20, 30, 40]"
            :page-size=pageSizeLimit
            layout="sizes, prev, pager, next"
            :total=taskPageTotal>
          </el-pagination>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col>
          <el-progress v-if="IsProgressBar" :percentage="IsProgressBar"></el-progress>
        </el-col>
      </el-row>
    </div>
    <!-- <el-dialog
      title="选择导出格式"
      :visible.sync="dialogVisible"
      width="20%">
      <el-radio v-model="type" label="0">json文件</el-radio>
      <el-radio v-model="type" label="1">xml文件</el-radio>

      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false" size="small">取 消</el-button>
            <el-button type="primary" @click="verify" size="small">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="选择导出格式"
      :visible.sync="dialogVisibleAll"
      width="20%">
      <el-radio v-model="type" label="0">json文件</el-radio>
      <el-radio v-model="type" label="1">xml文件</el-radio>

      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false" size="small">取 消</el-button>
            <el-button type="primary" @click="verifyAll" size="small">确 定</el-button>
        </span>
    </el-dialog> -->
  </div>
</template>


<script>
import compressionPackage from './compressionPackage.vue'
  export default {
    data () {
      return {
        searchExport: '',
        instanceName: '',
        isShow: 'compress',
        IsProgressBar: 0,
        taskPageTotal: 0,
        pageSizeLimit: 10,
        currentPages: 1,
        tableData: [],
        // 选择
        multipleSelection: [],
        // 搜索对象
        search: {
          label: '',
          instanceId:''
        },
        sampleOptions: [],
        type: '0',
        dialogVisible: false,
        livingList:[]
      }
    },
    created () {
      this.getExportZipList ()
    },
    mounted () {
      this.item()
      this.living()
    },
    components: {
      compressionPackage
    },
    methods: {
      // 删除导出文件
      delBtn (row) {
        // console.log('row++++', row)
        this.$confirm(`确认删除下载包---${row.filename}`, '删除下载包', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = {
            "id": row.id
          }
          this.$axios({
            method: 'post',
            url: '/exportZip/delExportZip',
            data: params
          })
          .then(res => {
            // console.log('resdel====', res)
            this.$message.success(res.data.msg)
            this.getExportZipList ()
          })
        })
      },
      // 导出资源集
      exportResource (row) {
        let params = {
          filename: row.filename 
        }
        this.$axios({
          method: 'post',
          url: '/exportZip/downloadZip',
          data: params,
          responseType: 'blob'
        })
        .then(res => {
          // console.log('res_+_+_+888', res)
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          var filename = res.headers['content-disposition'].replace('attachment; filename=', '')
          link.setAttribute('download', this.decodeUnicode(filename))
          document.body.appendChild(link)
          link.click()
        })
      },
      // 获取列表
      getExportZipList () {
        let params ={
          "pageIndex": this.currentPages,
          "pageSize": this.pageSizeLimit,
          "instanceName": this.searchExport,
        }
        this.$axios({
          method:'post',
          url:'/exportZip/getExportZipList',
          data: params,
        })
        .then(res=> {
          // console.log('res+_+__+_666', res)
          this.tableData = res.data.list
          this.taskPageTotal = res.data.total
        })
      },
      // 切换
      toggle () {
        this.isShow = 'compress'
      },
      // 选择场景
      searchScene(){
        this.currentPages = 1
        this.getExportZipList()
      },
      // 表格样式
      tableHeaderColor ({row, column, rowIndex, columnIndex}) {
        return 'background-color:#66B1FF;color:#fff;font-size:16px;text-align:center'
      },
      tableRowStyle ({row, rowIndex}) {
        return 'text-align:center'
      },
      // 获取搜索场景资源集
      living(){
        const this_ = this
        this.$axios({
            method: 'post',
            url: '/export/living',
          }).then(res => {
          // console.log(res)
          if (res.status == 200) {
            const data = res.data
            this_.livingList = data
          } else {
            console.error(res.statusText)
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      item () {
        const this_ = this
        this.$axios(
          {
            method: 'post',
            url: '/job/getDictData',
          }
        ).then(res => {
          console.log(res)
          if (res.status == 200) {
            const data = res.data
            this_.sampleOptions = data.label
          } else {
            console.error(res.statusText)
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      // 显示行数
      handleSizeChange (val) {
        this.pageSizeLimit = val
        this.getExportZipList()
      },
      // 选择当前页数
      handleCurrentChange (val) {
        this.currentPages = val
        this.getExportZipList()
      },

      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // verifyAll(){
      //   const this_ = this
      //   const type = this.type
      //   const methods1 = this
      //   this.$axios(
      //     {
      //       method: 'post',
      //       url: '/export/execAll',
      //       data: {type:type,instanceid:this_.search.instanceId},
      //       responseType: 'blob'
      //     }
      //   ).then(res => {
      //     // console.log(res)
      //     if (res.status == 200) {
      //       this.dialogVisibleAll = false
      //       this.IsProgressBar = 10
      //       if (this.IsProgressBar === 100) {
      //           this.IsProgressBar = 0
      //       }
      //       let url = window.URL.createObjectURL(new Blob([res.data]))
      //       let link = document.createElement('a')
      //       link.style.display = 'none'
      //       link.href = url
      //       var filename = res.headers['content-disposition'].replace('attachment; filename=', '')
      //       link.setAttribute('download', this_.decodeUnicode(filename))
      //       document.body.appendChild(link)
      //       link.click()
      //       methods1.dialogVisible = false
      //     } else {
      //       console.error(res.statusText)
      //       this.$message({
      //         type: 'error',
      //         message: res.statusText
      //       })
      //     }
      //   })
      // },
      // 确认
      // verify: function () {
      //   const this_ = this
      //   const type = this.type
      //   const methods1 = this
      //   var lists = []
      //   for (let i = 0; i < this.multipleSelection.length; i++) {
      //     lists.push({id: this.multipleSelection[i].id, type: type})
      //   }
      //   this.$axios(
      //     {
      //       method: 'post',
      //       url: '/export/exec',
      //       data: {lists: lists},
      //       responseType: 'blob'
      //     }
      //   ).then(res => {
      //     console.log(res)
      //     if (res.status == 200) {
      //       let url = window.URL.createObjectURL(new Blob([res.data]))
      //       let link = document.createElement('a')
      //       link.style.display = 'none'
      //       link.href = url
      //       var filename = res.headers['content-disposition'].replace('attachment; filename=', '')
      //       link.setAttribute('download', this_.decodeUnicode(filename))
      //       document.body.appendChild(link)
      //       link.click()
      //       methods1.dialogVisible = false
      //     } else {
      //       console.error(res.statusText)
      //       this.$message({
      //         type: 'error',
      //         message: res.statusText
      //       })
      //     }
      //   })
      // },
      decodeUnicode (str) {
        str = str.replace(/\\/g, '%')
        //转换中文
        str = unescape(str)
        //将其他受影响的转换回原来
        str = str.replace(/%/g, '\\')
        //对网址的链接进行处理
        str = str.replace(/\\/g, '')
        return str
      }
    }
  }
</script>

<style scoped lang="stylus">
  .uploadInputtext
    border: 1px solid #f6f6f6

  .createTaskName
    display: flex
    justify-content: center

  .selectSource
    display: flex
    justify-content: center

  .createTaskType
    display: flex
    justify-content: center

  .filesHandleContent
    display: flex
    justify-content: center
    margin-top: 10px

  .bottomRow
    margin-top: 10px
    display: flex;
    justify-content: flex-start;
    align-items: center;
  .rowhandle
    margin-bottom: 10px  

  // background-color:#f6f6f6
</style>
