<template>
  <div class="checkerContent">
    <div>
      <!-- <el-select v-model="labelprice" style="width:217px;" placeholder="请选择样本类别" :disabled="true">
        <el-option
          v-for="item in optionslabel"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select> -->
    </div>
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
      <el-button class="boxBtns" type="primary" size="small" @click="upPage">上一张</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="downPage">下一张</el-button>
    </div>
    <div>
      <p v-if="object.status == '1' ">驳回</p>
      <p v-if="object.status == '0' ">保存</p>
    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="move('pan')">移动</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="reject">驳回</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="keep">保存</el-button>
    </div>
    <div>
      <label>操作张数累计：</label>
      <el-input class="boxBtns" :disabled="true" size="small" v-model="accumulate"></el-input>
    </div>
    <div>
      <el-button class="boxBtns markBtn" type="success" size="small" @click="submit">提交</el-button>
    </div>

    <!-- 驳回意见弹框 -->
    <el-dialog title="驳回意见" :visible.sync="dialogFormVisible" width='400px'>
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
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialogFormVisible: false,
        textarea: '',
        dialogFormVisible: false,
        accumulate: 1,
        taskType: this.$parent.jobType,
        markType: 1,
        optionslabel: [],
        submitData: [],
        aduitImageList: [],
        news: '',
        object: {
          imageId: '',
          rejectDesc: '',
          status: ''
        },
        pagesNum: ''
      }
    },

    props: [
      'restPageNumChild',
      'checkerTaskType',
      'labelprice',
      'imageId',
      'remarkPoints'
    ],
    created () {
      this.pagesNum = this.$parent.pageIndex
      
    },
    mounted () {
      this.accumulate = 1
      this.item()
      this.$parent.initData(null)
    },
    methods: {
      // 驳回确认按钮
      rejectSureBtn () {
        // if (!this.textarea.trim()) {
        //   this.$message.error('驳回内容不可为空')
        //   return
        // }
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
          // console.log(res)
          if (res.status == 200) {
            const data = res.data
            this_.optionslabel = data.label
            // console.log(this_.optionslabel)
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
        var url = this.taskType == 4 ? '/job/batchAduitQXImage' : '/job/batchDealAduitJobResult'
        var data = this.taskType == 4 ? {aduitImageList: this.aduitImageList} : {dealAduitJobResultReqList: this.aduitImageList}
        console.log('aduitImageList===', this.aduitImageList)
        this.$axios(
          {
            method: 'post',
            url: url,
            data: data
          }
        ).then(res => {
          // console.log(res)
          if (res.status == 200) {
            this.accumulate = 1
            this.pagesNum++
            this.object = {
              imageId: '',
              rejectDesc: '',
              status: ''
            }
            this.textarea = ''
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
        this.dialogFormVisible = true
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
      // 上一张
      upPage () {
        if (this.pagesNum <= 1) {
          this.$message.error('这已是第一张图片')
          return
        }
        this.pagesNum--
        if (this.accumulate <= 1) {
          this.accumulate = 1
        }else {
          this.accumulate--
        }
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
      // 下一张
      downPage: function () {
        if (this.$parent.totalPageNum <= this.pagesNum) {
          this.$message.error('这已经是最后一张')
          return
        }
        if (this.object.status == '') {
          this.$message.error('请确认该张图片是否保存还是驳回')
          return
        }
        this.pagesNum++
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
          
          console.log('remarkPointsGdbis>>>>====', remarkPointsGdbis)
          this.init(remarkPointsGdbis)
        } else {
          this.init(null)
        }
      }
      ,
      // 翻页
      init (objectList) {
        // console.log('objectList==', objectList)
        this.$parent.pageIndex = this.pagesNum
        this.labelprice = this.$parent.labelprice
        this.$parent.initData(objectList)
        // console.log(this.aduitImageList)
      },

    },

    watch: {
      checkerTaskType: function (nv, ov) {
        this.taskType = nv
      }
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
