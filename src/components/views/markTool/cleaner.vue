<template>
  <div class="cleanerContent">
    <el-row style="display:flex;justify-content:center;margin-top:20px;">
      <!-- <el-col :span="6" class="editCol">修改图片文件名：</el-col>
      <el-col :span="8" class="editCol"> -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="修改图片文件名：" prop="fileName">
            <el-input v-model="ruleForm.fileName"  size="small" @keyup.enter.native="editFileName()"></el-input>
          </el-form-item>
        </el-form>
      <!-- </el-col> -->
      <!-- <el-col :span="6" class="editCol"><el-button type="primary" size="small" class="eidtFileBtn" @click="editFileName()">修改文件名</el-button></el-col> -->
    </el-row>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="up">上一张</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="below">下一张</el-button>
    </div>
    <div>
      <p v-if="item.status ==1 ">该张标记为清洗</p>
      <p v-if="item.status ==2 ">该张标记为保存</p>
    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="move('pan')">移动</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="rejectSingle">清洗该张</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="saveSingle">保存该张</el-button>
    </div>
    <div>
      <label>操作张数累计：</label>
      <el-input class="boxBtns" readonly v-model="accumulate" size="small"></el-input>
    </div>
    <div>
      <el-button class="boxBtns" type="success" size="small" @click="submit">提交</el-button>
    </div>


  </div>
</template>

<script>
  export default {
    data () {
      return {
        ruleForm: {
          fileName: ''
        },
        rules: {
          fileName: [
            { required: true, message: '请输入文件名', trigger: 'blur' },
            { pattern: /\.(jpg|jpeg|png|bmp|psd|JPG|JPEG)$/, message: '文件格式：jpg，png，jpeg，bmp，psd，JPG，JPEG请重新输入' }
          ]
        },
        accumulate: 1,
        markType: '',
        dialogFormVisible: false,
        sampleOptions: [],
        submitData: [],
        item: {
          imageId: '',
          label: '',
          status: ''
        },
        pagesNum: ''
      }
    },

    props: [
      'imageName'
    ],
    created() {
      this.pagesNum = this.$parent.pageIndex
    },
    mounted () {
      this.item = {
        imageId: '',
        label: '',
        status: ''
      }
      this.init(null)
    },
    watch: {
      imageName: function (nv, ov) {
        this.ruleForm.fileName = nv
      }
    },
    methods: {
      // 修改文件名
      editFileName () {
        let params = {
          "imageId": this.$parent.imgId,
          "imageName": this.ruleForm.fileName
        }
        this.$axios({
          method: 'post',
          url: '/job/renameImage',
          data: params
        })
        .then(res => {
          this.$message(res.data.msg)
          // this.init(null)
        })
        // this.$prompt('请输入文件名', '文件名修改', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputPattern: /[^\u4e00-\u9fa5/S]+\.(jpg|jpeg|png|bmp|psd|JPG|JPEG)$/,
        //   inputErrorMessage: '文件格式：英文+jpg，png，jpeg，bmp，psd，JPG，JPEG请重新输入'
        // }).then(({ value }) => {
        //   let params = {
        //     "imageId": this.$parent.imgId,
	      //     "imageName": value
        //   }
        //   this.$axios({
        //     method: 'post',
        //     url: '/job/renameImage',
        //     data: params
        //   })
        //   .then(res => {
        //     console.log('res===_+_+_+_+', res)
        //     this.$message(res.data.msg)
        //     this.init(null)
        //   })
        // })
      },
      // 移动
      move (mode) {
        this.$parent.setMode(mode)
      },
      // 上
      up () {
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
        this.item = {
          imageId: '',
          // label: '',
          status: ''
        }
        if (this.submitData.length >= this.accumulate) {
          this.item = this.submitData[this.accumulate - 1]
        }
        this.init(null)
      },
      // 下
      below () {
        if (this.$parent.totalPageNum <= this.pagesNum) {
          this.$message.error('这已经是最后一张')
          return
        }
        if (this.item.status == '') {
          this.$message.error('请确认该张图片是否清洗')
          return
        }
        this.pagesNum++
        this.accumulate++
        this.item = {
          imageId: '',
          label: '',
          status: ''
        }
        // console.log('this.submitData===xia', this.submitData)
        // console.log('this.item===xia', this.item)
        if (this.submitData.length >= this.accumulate) {
          this.item = this.submitData[this.accumulate - 1]
        }
        this.init(null)
      }
      ,
      // 翻页
      init (objectList) {
        this.$parent.pageIndex = this.pagesNum
        this.$parent.initData(objectList)
      },
      // 清洗该张
      rejectSingle () {
        this.item.imageId = this.$parent.imgId
        this.item.status = '1'
        for (let i = 0; i < this.submitData.length; i++) {
          if (this.submitData[i].imageId == this.item) {
            this.submitData[i].status = '1'
            console.log(this.submitData)
            return
          }
        }
        this.submitData.push(this.item)
      },
      // 保存该张
      saveSingle () {
        this.item.imageId = this.$parent.imgId
        this.item.status = '2'
        // debugger
        for (let i = 0; i < this.submitData.length; i++) {
          if (this.submitData[i].imageId == this.item.imageId) {
            this.submitData[i].status = '2'
            // console.log('this.submitData===baonei', this.submitData)
            return
          }
        }
        this.submitData.push(this.item)
        // console.log('this.submitData===bao',this.submitData)
      },
      // 提交清洗
      submit () {
        if (this.submitData.length < 1 ) {
          this.$message.error('没有内容可提交')
          return
        }
        if (this.item.status == '') {
          this.$message.error('请确认该张图片是否清洗')
          return
        }
        // console.log('this.submit++++', this.submitData)
        this.$axios({
          method: 'post',
          url: '/job/batchDealQingxiJobResult',
          data: {tempImages: this.submitData}
        })
        .then((res) => {
          console.log('res===++--===', res.data)
          this.item = {
            imageId: '',
            label: '',
            status: ''
          }
          this.accumulate = 1
          this.pagesNum++
          this.submitData= []
          this.init(null)
        })
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
  .editCol
    display:flex
    justify-content :center
    align-items :center
  .eidtFileBtn
    width: 100px  
</style>
