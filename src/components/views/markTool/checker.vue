<template>
  <div class="checkerContent">
    <div>
      <el-select v-model="labelprice" style="width:217px;" :disabled="true">
        <el-option
          v-for="item in optionslabel"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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
      <el-button class="boxBtns" type="primary" size="small" @click="up">上一张</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="below">下一张</el-button>
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
      <el-input class="boxBtns" :disabled="true" v-model="accumulate"></el-input>
    </div>
    <div>
      <el-button class="boxBtns markBtn" type="success" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
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
      'remarkPoints'
    ],
    mounted () {
      this.accumulate = 1
      this.item()
      this.$parent.initData(null)
    },
    methods: {
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
        var url = this.taskType == 4 ? '/job/batchAduitQXImage' : '/job/batchDealAduitJobResult'
        var data = this.taskType == 4 ? {aduitImageList: this.aduitImageList} : {dealAduitJobResultReqList: this.aduitImageList}
        this.$axios(
          {
            method: 'post',
            url: url,
            data: data
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
        if (this.object.status == '') {
          this.$message.error('请确认该张图片是否保存还是驳回')
          return
        }
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
