<template>
  <div class="checkerContent">
    <!-- <div>
      <el-select v-model="labelprice" style="width:217px;" :disabled="true">
        <el-option
          v-for="item in optionslabel"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div> -->
    <div style="margin-top:20px;" v-if="taskType === '3'">
      <!--      <el-select v-model="markType" :disabled="true">-->
      <!--        <el-option-->
      <!--          v-for="item in optionslabel"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label"-->
      <!--          :value="item.value"-->
      <!--        ></el-option>-->
      <!--      </el-select>-->
    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="up">上一张</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="below">下一张</el-button>
    </div>
    <div>
      <p v-if="object.status == '1' ">驳回</p>
      <p v-if="object.status == '0' ">归档</p>
    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="move('pan')">移动</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="reject">驳回</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="keep"
                 v-if="(checkerTaskType=='3' && imageSuat=='3' )">归档
      </el-button>
    </div>
    <div>
      <label>操作张数累计：</label>
      <el-input class="boxBtns" :disabled="true" v-model="accumulate"></el-input>
    </div>
    <div>
      <el-button class="boxBtns markBtn" type="success" size="small" @click="submit">提交</el-button>
      <el-button class="boxBtns markBtn" type="success" size="small" @click="allSubmit"
                 v-if="(checkerTaskType=='3' && jobStatus=='1')">全部归档
      </el-button>
    </div>
    <!-- <el-dialog title="驳回意见" :visible.sync="dialogFormVisible" width='400px'>
      <el-row>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入驳回意见"
          clearable
          v-model="textarea">
        </el-input>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="rejectSureBtn()" size="small">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialogFormVisible: false,
        textarea: '',
        accumulate: 1,
        taskType: this.$parent.jobType,
        markType: 1,
        optionslabel: [],
        submitData: [],
        aduitImageList: [],
        news: '',
        object: {
          imageId: '',
          status: ''
        }
      }
    },

    props: [
      'restPageNumChild',
      'checkerTaskType',
      'labelprice',
      'imageId',
      'remarkPoints',
      'usersid',
      'jobStatus',
      'jobId',
      'imageSuat'
    ],
    mounted () {
      this.accumulate = 1
      this.item()
      this.$parent.initData(null)
    },
    methods: {
      // 全部归档
      allSubmit () {
        const this_ = this
        this.$axios(
          {
            method: 'post',
            url: '/job/batchAduit',
            data: {
              "jobId": this_.jobId
            }
          }
        ).then(res => {
          console.log(res)
          if (res.status == 200) {
            this.$message.success('归档成功')
            this.$parent.initData(null)
          } else {
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      // 移动
      move (mode) {
        this.$parent.setMode(mode)
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
            this_.optionslabel = data.label
            console.log(this_.optionslabel)
          } else {
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      // 提交
      submit () {
        this.$axios(
          {
            method: 'post',
            url: '/job/batchFileImage',
            // '/job/batchDealRemarkJobResult'
            data: {fileImageReqList: this.aduitImageList}
          }
        ).then(res => {
          console.log(res)
          if (res.status == 200) {
            this.accumulate = 1
            this.object = {
              imageId: '',
              status: ''
            }
            this.aduitImageList = []

            this.init(null)
          } else {
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      // 驳回该张
      reject () {
        // this.dialogFormVisible =  true
         this.object = {
          'imageId': this.imageId,
          'status': '1'
        }
        for (let i = 0; i < this.aduitImageList.length; i++) {
          if (this.aduitImageList[i].imageId == this.imageId) {
            this.aduitImageList[i].status = '1'
          }
        }
        this.aduitImageList.push(this.object)
      },
      rejectSureBtn () {
        this.dialogFormVisible = false
        this.object = {
          'imageId': this.imageId,
          "rejectDesc": this.textarea.trim(),
          'status': '1'
        }
        for (let i = 0; i < this.aduitImageList.length; i++) {
          if (this.aduitImageList[i].imageId == this.imageId) {
            this.aduitImageList[i].status = '1'
          }
        }
        this.aduitImageList.push(this.object)
      },
      // 保存该张
      keep () {
        this.object = {
          'imageId': this.imageId,
          'status': '0'
        }
        for (let i = 0; i < this.aduitImageList.length; i++) {
          if (this.aduitImageList[i].imageId == this.imageId) {
            this.aduitImageList[i].status = '0'
          }
        }
        this.aduitImageList.push(this.object)
      },
      // 上
      up () {
        if (this.accumulate < 2) {
          return
        }
        this.accumulate--
        this.object = {
          imageId: '',
          status: ''
        }
        if (this.aduitImageList.length >= this.accumulate) {
          this.object = this.aduitImageList[this.accumulate - 1]
        }
        if (this.remarkPoints) {
          var remarkPointsGdbis = JSON.parse(this.remarkPoints)
          this.init(remarkPointsGdbis.gdbis)
        } else {
          this.init(null)
        }
      },
      // 下
      below: function () {
        if (this.$parent.totalPageNum <= this.accumulate) {
          return
        }
        // if (this.object.status == '') {
        //   this.$message.error('请确认该张图片是否保存还是驳回')
        //   return
        // }
        this.accumulate++
        this.object = {
          imageId: '',
          status: ''
        }
        if (this.aduitImageList.length >= this.accumulate) {
          this.object = this.aduitImageList[this.accumulate - 1]
        }
        if (this.remarkPoints) {
          var remarkPointsGdbis = JSON.parse(this.remarkPoints)
          this.init(remarkPointsGdbis.gdbis)
        } else {
          this.init(null)
        }
      }
      ,
      // 翻页
      init (objectList) {
        this.$parent.pageIndex = this.accumulate
        this.labelprice = this.$parent.labelprice
        this.$parent.initData(objectList)
        console.log(this.aduitImageList)
      },

    },

    watch: {
      checkerTaskType: function (nv, ov) {
        this.taskType = nv
      }
    },

    created: function () {

    }
  }
</script>

<style scoped lang="stylus">
  .boxBtns
    width: 100px
    margin: 20px 20px

  .boxBtns.markBtn
    width: 200px
    margin: 20px
</style>
