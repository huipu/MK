<template>
  <div class="adminCheckContent">
    <div>
      <el-select v-model="toolValue" placeholder="请选择样本类别" size="small" @change="toolChangeValue" @visible-change="sampleOpen">
        <el-option
          v-for="item in optionslabel"
          :key="item.value"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div style="margin-top:20px;">
      <el-select v-model="colorValue" placeholder="请选择标注框颜色" size="small" @change="setStrokeColor">
        <el-option
          v-for="item in colorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="move('pan')">移动图片</el-button>
      <el-button v-if="remarkType === '1'" class="boxBtns" type="primary" size="small" @click="move('drawRect')">
        绘制矩形
      </el-button>
      <el-button v-if="remarkType === '2'" class="boxBtns" type="primary" size="small"
                 @click="move('drawPolygon')">绘制多边形
      </el-button>
    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="del">删除标注</el-button>
    </div>
    <div>
      <el-button class="boxBtns" type="primary" size="small" @click="up">上一张</el-button>
      <el-button class="boxBtns" type="primary" size="small" @click="below">下一张</el-button>
    </div>
    <div>
      <div>
        <span>累积操作：</span>
        <el-input style=" width: 50px" v-model="accumulate" size="small" readonly></el-input>
      </div>
    </div>
    <div>
      <el-button class="boxBtns markBtn" type="success" size="small" @click="submitBtn">提交</el-button>
    </div>
    <div v-if="( rejectContent !== '' && rejectContent !== null)">
      <el-input
        type="textarea"
        :rows="2"
        v-model="textareaContent"
        style="width:300px;"
        :readonly="true"
        >
      </el-input>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        pagesNum: '',
        rejectContent: '',
        textareaContent: '',
        createSampleTypeValue: '',
        dialogFormVisible: false,
        // 累积数量
        accumulate: 1,
        markType: '',
        colorValue: '#145b7d',
        optionslabel: [],
        toolValue: '',
        dialogFormVisible: false,
        sampleOptions: this.$parent.sampleOptions,
        colorOptions: this.$parent.colorOptions,
        schema: 'drawRect',
        visible: false,
        elementList: []
      }
    },
    props: [
      'remarkType',
      'labelName',
      'rejectAdcice'
    ],
    created () {
      this.pagesNum = this.$parent.pageIndex
    },
    mounted () {},
    watch: {
      rejectAdcice: function (nv, ov) {
        this.rejectContent = nv
        this.textareaContent = '驳回意见：' + nv
      }
    },
    methods: {
      // 样本下拉出现触发
      sampleOpen (isOpen) {
        if (!isOpen) return
        let params = {
          "groupId": this.$parent.labelGroupId,
          "pageIndex": 1,
          "pageSize": 1000
        }
        this.$axios({
          method: 'post',
          url: '/label/getLabelList',
          data: params
        })
        .then(res => {
          this.optionslabel = res.data.list.map(item => {
            return item = {label: item.chLabel, value: item.id}
          })
        })
      },
      // 切换 样本类别
      toolChangeValue (v) {
        this.move('')
      },
      // 设置颜色
      setStrokeColor () {
        if (this.toolValue=="") {
          this.$message.error('请选择样本类别')
          return
        }
        this.move('drawRect')
        this.$parent.setStrokeColor(this.colorValue, '中国')
      },
      // 删除图层上所有的绘画图形和文字
      del () {
        this.$parent.gFeatureLayer.removeAllFeatures()
        this.$parent.delAllText()
        var itemList = []
        for (let i = 0; i < this.elementList; i++) {
          if (this.elementList[i].imgId != this.$parent.imgId) {
            itemList.push(this.elementList[i])
          }
        }
        this.elementList = itemList
      },
      // 移动
      move (mode) {
        if (this.toolValue=="") {
          this.$message.error('请选择样本类别')
          return
        }
        this.$parent.setMode(mode)
        this.$parent.setStrokeColor(this.colorValue, this.toolValue)
        // this.$parent.watchGeometryEditing(this.toolValue)
      },
      // 提交
      submitBtn () {
        console.log('this.elementList===1', this.elementList)
        console.log('this.$parent.gFeatureLayer.getAllFeatures()===1', this.$parent.gFeatureLayer.getAllFeatures().length)
        if ((this.elementList.length < 1) || (this.$parent.gFeatureLayer.getAllFeatures().length < 1)) {
          this.$message.error('没有标注资源提交,或当前页面为标注')
          return
        }
        if (this.elementList.length > 0) {
          var itemList = []
          for (let i = 0; i < this.elementList.length; i++) {
            if (this.elementList[i].imgId != this.$parent.imgId) {
              itemList.push(this.elementList[i])
            }
          }
          this.elementList = itemList
        }
        this.elementList.push({imgId: this.$parent.imgId, data: this.$parent.gFeatureLayer.getAllFeatures(), textData: this.$parent.gTextLayer.getAllTexts()})

        var imageList = []
        // 遍历所有图片
        for (let f = 0; f < this.elementList.length; f++) {
          var remarkPoints = []
          var gdbis = []
          let textInfo = []
          // 遍历一张图片上的所有图层信息
          for (let j = 0; j < this.elementList[f].data.length; j++) {

            var remarkPointsBound = []
            // 遍历每个图层的所有点
            for (let k = 0; k < this.elementList[f].data[j].points.length; k++) {
              remarkPointsBound.push(this.elementList[f].data[j].points[k])
            }
            remarkPoints.push({name: this.elementList[f].data[j].data.name, point: remarkPointsBound})
            gdbis.push({
              id: this.elementList[f].data[j].id,
              points: this.elementList[f].data[j].points,
              data: this.elementList[f].data[j].data,
              style: this.elementList[f].data[j].style
            })
            textInfo.push({
              id: this.elementList[f].textData[j].id,
              config: {
                width: this.elementList[f].textData[j].boxMaxWidth,
                offset: this.elementList[f].textData[j].offset,
                pos: this.elementList[f].textData[j].startPoint,
                text: this.elementList[f].textData[j].text
              },
              gStyle: {
                fontColor: this.elementList[f].textData[j].style.fontColor, 
                strokeColor: this.elementList[f].textData[j].style.strokeColor,
                opacity: this.elementList[f].textData[j].style.opacity
              }
            })

          }
          var image = {
            imageId: this.elementList[f].imgId,
            remarkPoints: JSON.stringify({points: remarkPoints, gdbis: gdbis, textInfo: textInfo})
          }
          // console.log('image++++++', image)
          imageList.push(image)
        }
        this.$axios({
          method: 'post',
          url: '/job/batchDealRemarkJobResult',
          data: {imageList: imageList},
        })
        .then(res => {
          // console.log('res===', res)
          if (res.status == 200) {
            this.$message.success('保存成功')
            this.accumulate = 1
            this.pagesNum++
            this.elementList = []
            this.init(null)
          } else {
            this.$message({
              type: 'error',
              message: res.statusText
            })
          }
        })
      },
      // 标注
      label () {
        this.$parent.setStrokeColor(this.colorValue)
        this.$parent.setMode(this.schema)
        this.visible = true
      },
      // 上一张
      up () {
        if (this.pagesNum <= 1) {
          this.$message.error('这已经是第一张图片')
          return
        }
        if (this.accumulate <= 1) {
          this.accumulate = 1
        }else {
          this.accumulate--
        }
        this.pagesNum--
        
        // console.log('this.elementList-=-=-=', this.elementList)

        // const objectList = this.elementList[this.elementList.length - 1].data
        // this.elementList = this.elementList.slice(0, this.elementList.length - 1)
        // console.log('objectList====', this.objectList)
        // console.log('this.elementList====', this.elementList)

        this.init(null)
      },
      // 下一张
      below () {
        if (this.$parent.totalPageNum <= this.pagesNum) {
          this.$message.error('这已是最后一张图片')
          return
        }
        if (this.$parent.gFeatureLayer.getAllFeatures().length < 1) {
          this.$message.error('该图片还未进行标注')
          return
        }
        this.accumulate++
        this.pagesNum++
        this.elementList.push({imgId: this.$parent.imgId, data: this.$parent.gFeatureLayer.getAllFeatures(), textData: this.$parent.gTextLayer.getAllTexts()})
        // console.info(this.elementList)
        this.init(null)
      },
      // 翻页
      init (objectList, pageType) {
        this.$parent.pageIndex = this.pagesNum
        // console.log('this.$parent.pageIndex-=-=-=', this.$parent.pageIndex)
        this.$parent.initData(objectList)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .accumulateclass {
    width: 50px;
  }
  .boxBtns
    width: 100px
    margin: 20px 20px

  .zZindex {
    z-index: 30000000;
  }

</style>
