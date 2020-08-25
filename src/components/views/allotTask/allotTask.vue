<template>
  <div class="allotTaskContent">
    <div>
      <div class="handleRow">
        <el-button type="primary" @click="outerVisible = true" size="small" style="height:32px;">创建任务</el-button>
        <el-dialog title="创建任务" :visible.sync="outerVisible" width="27%" @close="closeOuterDialog">
          <el-dialog
            width="30%"
            title="选择资源集"
            :visible.sync="innerVisible"
            append-to-body
            @close="closeInnerDialog">
            <el-table
              ref="singleTable"
              :data="tableDataIf"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <!-- <el-table-column
              property="date"
              label="创建日期"
              width="120">
              </el-table-column> -->
              <el-table-column
                prop="instancename"
                label="资源集名"
                width="120">
              </el-table-column>
            </el-table>
            <el-pagination
              style="float:right;margin-top:10px;"
              background
              layout="sizes, prev, pager, next"
              :current-page="curPageIndex"
              @current-change="curPageChange"
              :page-size="curPageSize"
              @size-change="curhandleSizeChange"
              :page-sizes="[10, 15, 20, 25, 30]"
              :total="curTotalPages"
            >
            </el-pagination>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="innerVisible = false">取消</el-button>
              <el-button type="primary" size="small" @click="innertableSourBtn">确定</el-button>
            </div>
          </el-dialog>

          <el-row class="createTaskType">
            <el-col :span="8">任务类型：</el-col>
            <el-col :span="13">
              <el-select v-model="valuetask" placeholder="请选择" @change="valuetaskChange()" size="small"
                         class="selectTaskType" style="width:100%">
                <el-option
                  v-for="item in taskOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="selectSource">
            <el-col :span="8">请选择资源集：</el-col>
            <el-col :span="13">
              <el-input
                class="inputSource"
                size="small"
                placeholder="请选择资源集"
                v-model="selectFiles"
                clearable
                @focus="selectSourcefocus()">
              </el-input>
              <!-- <el-button type="text" @click="dialogTableVisible = true">请选择资源集</el-button> -->
              <!-- <el-button type="primary" @click="innerVisible = true">请选择资源集</el-button> -->
            </el-col>
          </el-row>
          <el-row class="createTaskName">
            <el-col :span="8">任务名称：</el-col>
            <el-col :span="13">
              <el-input v-model="taskNameInput" placeholder="请输入内容" class="inputTaskName" size="small"></el-input>
            </el-col>
          </el-row>
          <el-row class="createMarkType" v-if="valuetask==='2'">
            <el-col :span="8">标注类型：</el-col>
            <el-col :span="13">
              <el-select v-model="valueMark" placeholder="请选择" class="selectMarkType" size="small" style="width:100%">
                <el-option
                  v-for="item in valueMarkoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="chooseSample" v-if="valuetask==='2'">
            <el-col :span='8'>
              选择类别：
            </el-col>
            <el-col :span="13">
              <el-select v-model="sampleValue" placeholder="请选择" class="selectMarkType" size="small" style="width:100%" @visible-change="sampleOpen">
                <el-option
                  v-for="item in sampleValueOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="outerVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="createTaskBtn()">确定</el-button>
          </div>
        </el-dialog>

        <!-- <a class="uploadA">选取文件夹
          <input ref='uploadInput' type='file' webkitdirectory class="uploadInputtext" value="选择文件夹" readonly
                 @change.stop="changesData">
        </a>
        <el-button id="upload-btn" type="success" size="small" style="margin-right:20px;" @click="uploadbtn()">上传
        </el-button> -->

        <el-select v-model="taskTypeValue" placeholder="请筛选任务类型" clearable  size="small" style="margin:0 20px 0 20px"
                   @change="pickTask">
          <el-option
            v-for="item in taskTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- "https://jsonplaceholder.typicode.com/posts/" -->
        <el-upload
          class="upload-demo"
          action="api/job/fileUpload"
          accept='application/x-zip-compressed'
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :limit="1"
          :on-exceed="handleExceed">
          <el-button size="small" type="primary" style="margin-right:10px;">点击上传</el-button>
          <span slot="tip" class="el-upload__tip">只能上传zip压缩文件，且不超过1G，图片格式（jpg，png，jpeg，bmp，psd，JPG，JPEG）</span>
        </el-upload>
        <!-- <el-button type="primary" size="small" style="margin-left:30px;height:32px;" @click="createSampleType()">新建样本类别</el-button>
        <el-dialog title="新建样本类别" :visible.sync="dialogFormVisible" width="300px" style="z-index:99999;">
          <el-input v-model="createSampleTypeValue" placeholder="请输入样本类别(中)" style="width:200px;margin-bottom:10px;" size="small"></el-input>
          <el-input v-model="createSampleTypeValueEn" placeholder="请输入样本类别(英)" style="width:200px;" size="small"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="sureBtn" size="small">确 定</el-button>
          </div>
        </el-dialog> -->
      </div>

      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 1198px"
        :header-row-style="headstyle"
        :header-cell-style="tableHeaderColor"
        :cell-style="tableRowStyle"
        :row-style="tableRowsStyle"
        border
      >
        <!-- <el-table-column
            type="selection"
            width="55"
            center>
        </el-table-column> -->
        <el-table-column
          label="日期"
          prop="createTime"
          width="120">
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column
          prop="jobName"
          label="任务名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="remarkTypeName"
          label="标注类型"
          width="100">
        </el-table-column>
        <el-table-column
          width="120"
          prop="jobTypeName"
          label="任务类型"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          width="100"
          prop="jobStatusName"
          label="任务状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          width="300"
          label="任务分派名单"
        >
          <template slot-scope="scope">
            <el-button @click="markpeo(scope.row, key)" type="text" size="small" v-for="(item, key) in scope.row.users"
                       :key="key">
              {{item.nicknames}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="一键操作" width="160">
          <template slot-scope="scope">
            <el-button
              style="width:104px;"
              v-if="(scope.row.jobType==='1'|| scope.row.jobType==='3'||scope.row.jobType==='4') "
              size="mini"
              type="primary"
              @click="oneKeyClean(scope.row)">
              {{scope.row.jobType==='1' ? '一键清洗': (scope.row.jobType==='3' ? '一键审核标注' : (scope.row.jobType==='4' ?
              '一键审核清洗' : ''))}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.jobType==='1'"
              :ref="`popover-${scope.$index}`"
              placement="right"
              width="249"
              popper-class="disEmpoloy"
            >
              <div class="search-Box">
                <el-input placeholder="搜索更多人员" prefix-icon="el-icon-search" size="small" class="search"
                          v-model="search"></el-input>
              </div>
              <el-table
                :data="allotTableData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column width="120" prop="nickname" label="姓名(工号)"></el-table-column>
                <el-table-column width="65" prop="jobNum" label="任务量"></el-table-column>
              </el-table>
              <el-button type="primary" size="small" style="float:right;margin-top:10px;" @click="sourBtn(scope)">确定
              </el-button>
              <el-button slot="reference" type="text" size="small" @click="distributeMarkCheck(scope.row.jobType)">
                分配清洗任务
              </el-button>
            </el-popover>

            <el-popover
              v-if="scope.row.jobType==='2'"
              :ref="`popover-${scope.$index}`"
              placement="right"
              width="249"
              popper-class="disEmpoloy"
            >
              <div class="search-Box">
                <el-input placeholder="搜索更多人员" prefix-icon="el-icon-search" size="small" class="search"
                          v-model="search"></el-input>
              </div>
              <el-table
                :data="allotTableData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column width="120" prop="nickname" label="姓名(工号)"></el-table-column>
                <el-table-column width="65" prop="jobNum" label="任务量"></el-table-column>
              </el-table>
              <el-button type="primary" size="small" style="float:right;margin-top:10px;" @click="sourBtn(scope)">确定
              </el-button>
              <el-button slot="reference" type="text" size="small" @click="distributeMarkCheck(scope.row.jobType)">
                分配标注任务
              </el-button>
            </el-popover>

            <el-popover
              v-if="scope.row.jobType==='3'"
              :ref="`popover-${scope.$index}`"
              placement="right"
              width="249"
              popper-class="disEmpoloy"
            >
              <div class="search-Box">
                <el-input placeholder="搜索更多人员" prefix-icon="el-icon-search" size="small" class="search"
                          v-model="search"></el-input>
              </div>
              <el-table
                :data="allotTableData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column width="120" prop="nickname" label="姓名(工号)"></el-table-column>
                <el-table-column width="65" prop="jobNum" label="任务量"></el-table-column>
              </el-table>
              <el-button type="primary" size="small" style="float:right;margin-top:10px;" @click="sourBtn(scope)">确定
              </el-button>
              <el-button slot="reference" type="text" size="small" @click="distributeMarkCheck(scope.row.jobType)">
                分配审核标注任务
              </el-button>
            </el-popover>
            <el-popover
              v-if="scope.row.jobType==='4'"
              :ref="`popover-${scope.$index}`"
              placement="right"
              width="249"
              popper-class="disEmpoloy"
            >
              <div class="search-Box">
                <el-input placeholder="搜索更多人员" prefix-icon="el-icon-search" size="small" class="search"
                          v-model="search"></el-input>
              </div>
              <el-table
                :data="allotTableData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column width="120" prop="nickname" label="姓名(工号)"></el-table-column>
                <el-table-column width="65" prop="jobNum" label="任务量"></el-table-column>
              </el-table>
              <el-button type="primary" size="small" style="float:right;margin-top:10px;" @click="sourBtn(scope)">确定
              </el-button>
              <el-button slot="reference" type="text" size="small" @click="distributeMarkCheck(scope.row.jobType)">
                分配审核清洗任务
              </el-button>
            </el-popover>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float:right;margin-top:10px;"
        background
        layout="sizes, prev, pager, next"
        :page-sizes="[10, 15, 20, 25, 30]"
        :page-size="pageSizeLimit"
        :current-page="currentPages"
        @current-change="currentChange"
        @size-change="handleSizeChange"
        :total="taskPageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        sampleValueOptions: '',
        sampleValue: '',
        dialogFormVisible:false,
        createSampleTypeValue: '',
        createSampleTypeValueEn: '',
        curPageSize: 10,
        curPageIndex: 1,
        curTotalPages: 0,
        jobTypeParam: '',
        tableDataIf: [],
        outerVisible: false,
        selectUploadVal: '',
        taskOptions: '',
        pageSizeLimit: 10,
        taskNameInput: '',
        currentPages: 1,
        currentPagesResources: 1,
        taskPageTotal: 0,
        allotTableDataSpare: [],
        innerTableData: '',
        innerclearTableData: '',
        outerVisible: false,
        innerVisible: false,
        // dialogTableVisible: false,
        selectFiles: '',
        fd: new FormData(),
        taskTypeOptions: [],
        taskTypeValue: '',
        valueMark: '',
        uploadFiles: [],
        valuetask: '',
        values: '',
        visible: false,
        search: '',
        searchMore: '',
        gridData: [],
        tableData: [],
        multipleSelection: [],
        options: [],
        valueMarkoptions: [],
        tableDataDeal: [],
        currentRow: {instancename: ''}
      }
    },
    methods: {
      // 类别下拉出现时触发
      sampleOpen (isOpen) {
        if (!isOpen) return
        this.$axios({
          method: 'post',
          url: '/label/getLabelTree',
          data: ''
        })
        .then(res => {
          // console.log('res_+_+_+_+_+999', res)
          this.sampleValueOptions =  res.data.map(item => {
            // console.log('item-=-=--=', item)
            return item = {label: item.groupname ,value: item.id}
          })
          // console.log('this.sampleValueOptions-=-=--=', this.sampleValueOptions)
        })
      },
      // 关闭外弹框时初始化框内表单
      closeOuterDialog () {
        this.valuetask = ''
        this.selectFiles = ''
        this.taskNameInput = ''
        this.valueMark = ''
      },
      // 关闭内弹框时初始化框内表单
      closeInnerDialog () {
        this.curPageIndex = 1
        this.curPageSize = 10
        this.curTotalPages = 0
        this.tableDataIf = []
      },
      // 删除任务
      handleDelete (row) {
        // console.log('row>>>>', row)
        let params = {
          jobId: row.id.toString()
        }
        this.$axios({
          method: 'post',
          url: '/job/deleteJobById',
          data: params
        })
        .then((res)=>{
          // console.log('res>>>', res)
          this.$message(res.data.msg)
          this.getTableData()
        })
      },
      // 新建样本类别
      createSampleType () {
        this.createSampleTypeValue = ''
        this.createSampleTypeValueEn = ''
        this.dialogFormVisible = true
      },
      sureBtn () {
        if (this.createSampleTypeValue === '' || this.createSampleTypeValueEn === '') {
          this.$message.error('样本名不可为空')
          return
        }
        this.dialogFormVisible = false
        let params = {
          'dicCode': 'label',
          'instanceValue': this.createSampleTypeValue,
          'instanceCode': this.createSampleTypeValueEn
        }
        this.$axios({
          method: 'post',
          url: '/job/saveDict',
          data: params
        }).then( res => {
          // console.log('res=====+++', res)
          this.$message(res.data.msg)
          this.item()
        })
      },
      //一键清洗
      oneKeyClean (row) {
        console.log('row===', row)
        if (!row.users) {
          this.$message.error('请分配人员')
          return
        }
        let URL = ''
        if (row.jobType === '1') {
          URL = '/job/rootQXImage'
        }
        if (row.jobType === '3') {
          URL = '/job/rootAduitRemarkImage'
        }
        if (row.jobType === '4') {
          URL = '/job/rootAduitQXImage'
        }
        let params = {
          jobId: row.id
        }
        this.$axios({
          method: 'post',
          url: URL,
          data: params
        })
          .then(res => {
            console.log('res===', res)
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getTableData()
          })
      },
      //上传文件
      beforeUpload (file) {
        console.log('files===', file)
        let limitFileSize = (file.size / 1024 / 1024 / 1024) <= 1
        if (!limitFileSize) {
          this.$message({
            message: '上传文件大小不能超过4G!',
            type: 'warning'
          })
        }
        return limitFileSize
      },
      handleExceed (files, fileList) {
        console.log('fileList===', fileList)
        this.$message.warning(`当前限制选择 1个文件，请删除已选文件后在上传`)
      },
      handlePreview () {

      },
      handleRemove () {

      },
      // 当前页数
      curPageChange (val) {
        this.curPageIndex = val
        this.currentPagesResources = val
        if (this.valuetask === '1' || this.valuetask === '4') {
          this.selectClearSource()
        } else {
          this.selecthandleSource()
        }
      },
      curhandleSizeChange (val) {
        this.curPageSize = val
        if (this.valuetask === '1' || this.valuetask === '4') {
          this.selectClearSource()
        } else {
          this.selecthandleSource()
        }
      },
      item () {
        const this_ = this
        this.$axios(
          {
            method: 'post',
            url: '/job/getDictData',
          }
        ).then(res => {
          if (res.status == 200) {
            const data = res.data
            const jobType = data.jobType
            const remarkType = data.remarkType
            // console.log('jobType====', jobType)
            this_.taskTypeOptions.push(...jobType)
            this_.valueMarkoptions = remarkType
          } else {
            // console.error(res.statusText)
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      handleSizeChange (val) {
        this.pageSizeLimit = val
        this.getTableData()
      },
      valuetaskChange () {
        this.selectFiles = ''
      },
      innertableSourBtn () {
        if (this.currentRow == null || this.currentRow.instancename === '') {
          this.$message.error('请选择资源集')
          return
        }
        this.selectFiles = this.currentRow.instancename
        this.innerVisible = false
      },
      createTaskBtn () {
        let params = {
          'jobName': this.taskNameInput,
          'instanceName': this.selectFiles,
          'jobType': this.valuetask,
          'remarkType': this.valueMark,
          "labelGroupId": this.sampleValue
        }
        this.$axios({
          method: 'post',
          url: '/job/createJob',
          data: params
        })
          .then((res) => {
            if (res.data.msg === '任务已存在，创建任务失败') {
              this.$message.error(res.data.msg)
              return
            }else {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            }
            this.getTableData()
            this.outerVisible = false
          })
          .catch((err) => {
            // console.log('err==',err)
          })
      },
      pickTask (val) {
        this.currentPages = 1
        this.jobTypeParam = val
        this.getTableData()
      },
      handleCurrentChange (val) {
        this.currentRow = val
        console.log('this.currentRow==', this.currentRow)
      },
      currentChange (val) {
        this.currentPages = val
        this.getTableData()
      },
      distributeMarkCheck (jobType) {
        this.distributeTask(jobType)
      },
      distributeTask (jobType) {
        this.$axios({
          method: 'post',
          url: '/job/getUsers',
          data: {'jobType': jobType}
        })
          .then((res) => {
            this.allotTableDataSpare = res.data
          })
          .catch((err) => {
            // console.log('err==',err)
          })
      },
      selectSourcefocus () {
        if (!this.valuetask) {
          return this.$message.error('任务类型不为空')
        }
        if (this.valuetask === '1' || this.valuetask === '4') {
          this.innerVisible = true
          this.selectClearSource()
        } else {
          this.innerVisible = true
          this.selecthandleSource()
        }

      },
      createTask () {
        this.$axios({
          method: 'post',
          url: '/job/createJob',
          data: ''
        })
          .then((res) => {
            this.valueMarkoptions = res.data.remarkType
            this.taskOptions = res.data.jobType
          })
          .catch((err) => {
            // console.log('err==',err)
          })
      },

      // 选择清洗资源集（清洗、审核清洗） 
      selectClearSource () {
        const data = {
          jobType: this.valuetask,
          pageIndex: this.curPageIndex,
          pageSize: this.curPageSize,
        }
        this.$axios({
          method: 'post',
          url: '/job/getTempInstanceNames',
          data: data
        })
        .then((res) => {
          this.innerclearTableData = res.data.list
          this.tableDataIf = this.innerclearTableData
          this.curTotalPages = res.data.total
        })
        .catch((err) => {
          // console.log('err==',err)
        })
      },

      // 选择标注和审核标注资源集
      selecthandleSource () {
        let params = {
          jobType: this.valuetask,
          pageIndex: this.curPageIndex,
          pageSize: this.curPageSize
        }
        this.$axios({
          method: 'post',
          url: '/job/getInstances',
          data: params
        })
          .then((res) => {
            console.log('res===++__==1', res.data.list)
            // this.innerclearTableData = res.data.list
            this.tableDataIf = res.data.list
          })
      },
      selectSource () {
        this.$axios({
          method: 'post',
          url: '/job/createJob',
          data: ''
        })
          .then((res) => {
            // console.log('res===',res)
            this.valueMarkoptions = res.data.remarkType
            this.taskOptions = res.data.jobType
          })
          .catch((err) => {
            // console.log('err==',err)
          })
      },
      getMarkTask () {
        this.$axios({
          method: 'post',
          url: '/job/getDictData',
          data: ''
        })
          .then((res) => {
            console.log('res===', res)
            this.valueMarkoptions = res.data.remarkType
            this.taskOptions = res.data.jobType
          })
          .catch((err) => {
            // console.log('err==',err)
          })
      },
      getTableData () {
        let params = {
          pageIndex: this.currentPages,
          pageSize: this.pageSizeLimit,
          jobType: this.jobTypeParam,
          // users:this.userid,
        }
        // console.log('params==', params)
        this.$axios({
          method: 'post',
          url: '/job/getJobList',
          data: params
        })
          .then((res) => {
            // console.log('res===++', res.data.jobs.total)
            this.tableDataDeal = res.data.jobs.list
            this.tableDataDeal.forEach(item => {
              item.jobStatusName = item.jobStatus == '0' ? '未完成' : '完成'
              item.createTime = item.createTime.slice(0, 10)
              if (item.users) {
                item.users = item.users.split(';')
                item.users.forEach((i, key) => {
                  item.users[key] = JSON.parse(i)
                })
              }
            })
            this.tableData = this.tableDataDeal
            // console.log('this.tableData==++', this.tableData)
            this.taskPageTotal = res.data.jobs.total
            // this.tableData.length
          })
          .catch((err) => {
            // console.log('err==',err)
          })
      },
      diagsource () {

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
      sourCheckBtn (scope) {

        scope._self.$refs[`popover-${scope.$index}`].doClose()
      },
      handleSelectionChange (val) {
        // console.log('val===', val)
        this.multipleSelection = val
      },
      headstyle ({row, rowIndex}) {
        // return 'background-color:lightblue'
      },
      tableHeaderColor ({row, column, rowIndex, columnIndex}) {
        return 'background-color:#66B1FF;color:#fff;font-size:16px;text-align:center'
      },
      tableRowStyle ({row, rowIndex}) {
        return 'text-align:center'
      },
      tableRowsStyle ({row, rowIndex}) {
        // return 'backgroundColor:#e6e6e6'
      },
      sourBtn (scope) {
        // console.log('scoped==', scope)
        let userids = []
        this.multipleSelection.map(i => userids.push(i.userid))
        // console.log('userids==', userids)
        // console.log('this.multipleSelection==', this.multipleSelection)
        let params = {
          multipleSelection: userids,
          jobId: scope.row.id,
          jobType: scope.row.jobType
        }
        this.$axios({
          method: 'post',
          url: '/job/assignJob',
          data: params
        })
          .then((res) => {
            // console.log('res==++', res)
            if (res.data.msg === '下发任务成功') {
              this.$message.success('下发任务成功')
            }
            this.getTableData()
          })
        scope._self.$refs[`popover-${scope.$index}`].doClose()
      },
      moreSourBtn () {
        this.visible = false
      },
      markpeo (row, key) {
        // console.log('row==test============', row)
        let userId = row.users[key].userid
        // console.log('row==test============', userId)
        this.$router.push({
          path: '/home/myWork',
          query: {data: row, userId: userId}
        })
      },

      checkedPeo (row, key) {
        this.$router.push({path: '/home/myWork', query: {name: row.employeeName[key].id}})
      },

      uploadbtn () {
        // var fd = new FormData();
        let filesPath = []
        for (var i = 0; i < this.uploadFiles.length; i++) {
          this.fd.append('files', this.uploadFiles[i])
          // console.log('fd===', this.fd)
          // filesPath.push(this.uploadFiles[i].webkitRelativePath)
        }
        // console.log('fds===', this.fd)
        if (this.uploadFiles.length > 0) {
          let params = {
            fileName: this.uploadFiles[0].webkitRelativePath.split('/')[0],
            files: this.fd,
            urls: filesPath
          }
          // console.log('params==',params)
          // console.log('this.$refs.uploadInput.outerHTML==',this.$refs)
          // this.$refs.uploadInput.outerHTML = this.$refs.uploadInput.outerHTML
          this.$axios({
            method: 'post',
            url: '/job/fileUpload',
            data: this.fd,
            contentType: false,
            processData: false
          })
            .then((res) => {
              this.$message({
                message: '上传成功',
                type: 'success'
              })
            })
            .catch((err) => {
              // console.log('err==',err)
            })
        }
      },

      changesData () {
        this.uploadFiles = this.$refs.uploadInput.files
        // console.log('this.uploadFiles==', this.uploadFiles)
      },

      selectUploadBtn () {
        // console.log('this.$refs.uploadInput==', this.$refs.uploadInput)
        this.$refs.uploadInput.click()
      },
    },
    created: function () {
      this.getMarkTask()
      this.getTableData()
      // this.selectClearSource()
      this.item()
    },
    computed: {
      allotTableData: function () {
        var search = this.search
        if (search) {
          return this.allotTableDataSpare.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.allotTableDataSpare
      },
      userid: function () {
        return this.$store.state.auth.userid
      }
    }
  }
</script>

<style scoped lang="stylus">
  .allotTaskContent
    display: flex
    justify-content: center

  .uploadInputtext
    opacity: 0;
    font-size: 12px;
    height: 32px;
    position: absolute;
    left: 0;
    width: 160px;
    cursor: pointer;

  // border:1px solid #f6f6f6
  .createTaskName, .createMarkType, .selectSource, .createTaskType, .chooseSample
    display: flex
    justify-content: center
    align-items: center
    margin-top: 5px

  .handleRow
    margin: 20px 0 30px 0
    display: flex
    justify-content: flex-start

  .uploadA
    position: relative;
    display: inline-block;
    text-align: center;
    color: #fff;
    text-decoration: none;
    width: 160px;
    height: 32px;
    line-height: 32px;
    background: #409eff;
    border-radius: 3px;
    font-size: 14px;
    margin-left: 20px;
  .el-upload__tip
    color: red  

</style>
