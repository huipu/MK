<template>
  <div class="myWorkContent">
    <div class="leftContent">
      <fieldset class="leftField">
        <legend>图片</legend>
        <div id="containId">
          <!--                    <img :src="base64" style="width:100%;height:100%;">-->
        </div>
      </fieldset>
    </div>

    <div class="rightcontent">
      <fieldset class="rightField">
        <legend>操作</legend>
        <div>
          <div class="btnBox">
            <div class="taskname-lastpages">
              <div class="taskInfo">
                <label style="color: #606266;">任务名：</label>
                <span>{{jobName}}</span>
              </div>
              <div class="taskInfo" v-if="role !== '1'">
                <label>剩余张数：</label>
                <span>{{jobType === '4' ? '' : restPages + '/'}}{{totalPageNum}}</span>
              </div>
            </div>
            <!-- :restPageNumChild="restPageNum" @cilckRestPageNum="handledRestPageNum" -->
            <adminCheck
              v-if="role === '1'"
              :usersid="usersid"
              :checkerTaskType="jobType"
              :labelprice="labelprice"
              :imageId="imgId"
              :jobStatus="jobStatus"
              :jobId="id"
              :imageSuat="imageSuat"
            ></adminCheck>
            <cleaner v-if="(role === '2') && (jobType === '1')" :imageName="imageName"></cleaner>
            <signCheck
              v-if="(role === '2') && (jobType === '2')"
              :remarkType="remarkType"
              :labelName="labelName"
              :rejectAdcice="rejectAdcice"
            ></signCheck>
            <!-- 审核标注 -->
            <auditMarking
              v-if="(role === '2') && (jobType === '3')"
              :checkerTaskType="jobType"
              :labelprice="labelprice"
              :remarkPoints="remarkPoints"
              :imageId="imgId"
            ></auditMarking>
            <!-- 审核清洗 -->
            <auditCleaning
              v-if="(role === '2') && (jobType === '4')"
              :checkerTaskType="jobType"
              :labelprice="labelprice"
              :imageId="imgId"
            ></auditCleaning>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import gDBox from "gdbox";
import adminCheck from "./adminCheck.vue";
import signCheck from "./signCheck";
import cleaner from "./cleaner.vue";
import auditCleaning from "./auditCleaning.vue";
import auditMarking from  "./auditMarking.vue";

export default {
  data() {
    return {
      imageName: '',
      rejectAdcice: '',
      // isShowBtn: !((this.jobStatus === '1') && (this.jobType === '3')),
      dialogVisible: false,
      type: "0",
      userid: this.$store.state.auth.userid,
      base64: "",
      pageIndex: 1,
      totalPageNum: 0,
      restPages: 0,
      upLimitRestPages: 0,
      // drawColor: '',
      markType: "",
      typeValue: "",
      taskName: "",
      jobName: "",
      id: "",
      jobType: this.$route.query ? this.$route.query.jobType : "",
      jobStatus: this.$route.query ? this.$route.query.jobStatus : "",
      imgId: "",
      labelprice: "",
      labelName: "",
      remarkType: "",
      remarkPoints: "",
      usersid: "",
      imageSuat: "",
      colorOptions: [
        {
          value: "#d71345",
          label: "红色"
        },
        {
          value: "#ffd400",
          label: "黄色"
        },
        {
          value: "#130c0e",
          label: "黑色"
        },
        {
          value: "#f6f6f6",
          label: "白色"
        },
        {
          value: "#145b7d",
          label: "蓝色"
        },
        {
          value: "#8552a1",
          label: "紫色"
        }
      ],
      getcomplete: [],
      gMap: null,
      gFeatureLayer: null,
      gTextLayer: null,
      text: null,
      curUserId: "",
      adminUserId: '',
      labelGroupId: ''
    };
  },
  created: function() {
    let types = this.$route.query.data.jobType
    if (types == '2' || types === '1' || types === '3') {
      if (this.$route.query && this.$route.query.pageIndex) {
        this.pageIndex = this.$route.query.pageIndex
        console.log('this.pageIndex -=-=', this.pageIndex)
      }
      
      // console.log('this_.pageindex====', this.$route.query.pageIndex)
    }
    this.initData(null)
  },
  mounted() {},
  watch: {
    // totalPageNum (nv, ov) {
    //   // console.log('nv=====', nv)
    //   this.restPages = nv - this.pageIndex + 1
    //   this.upLimitRestPages = this.restPages
    // }
  },
  methods: {
    uploadBtn() {
      this.dialogVisible = true;
    },
    verify() {
      let params = {
        fileType: this.type
      };
      this.$axios({
        methods: "",
        url: "",
        data: params
      })
      .then(res => {
        this.dialogVisible = false;
      })
      .catch(err => {
        console.log("err", err)
      })
    },

    // 获取坐标位
    getBounds(points) {
      return new gDBox.Util.getBounds(points);
    },

    // 设置标注颜色以及获取标注信息
    setStrokeColor(strokeColor, name) {
      const gFetureStyle = new gDBox.Style({
        strokeColor: strokeColor,
        fillColor: "#FF0000",
        opacity: 0.3,
        lineWeight: 1
      });
      const this_ = this;
      this_.gMap.events.on("geometryDrawDone", function(type, points) {
        // 生成元素唯一标志（时间戳）
        const timestamp = new Date().getTime();
        // 元素添加展示
        if (type === "rect") {
          let fea = new gDBox.Feature.Rect(
            `feature-${timestamp}`,
            points,
            {
              name: name.value,
              label: name.label
            },
            gFetureStyle
          );
          this_.gFeatureLayer.addFeature(fea);

          const bounds = gDBox.Util.getBounds(points);
          this_.showBoxSimple(`feature-${timestamp}`, name.label, bounds);
        } else if (type === "polygon") {
          let fea = new gDBox.Feature.Polygon(
            `feature-${timestamp}`,
            points,
            {
              name: name.value,
              label: name.label
            },
            gFetureStyle
          );
          this_.gFeatureLayer.addFeature(fea);
          const bounds = gDBox.Util.getBounds(points);
          this_.showBoxSimple(`feature-${timestamp}`, name.label, bounds);
        }
      });
    },

    // 在框内显示样本类别添加
    showBoxSimple(id, name, points) {
      const this_ = this;
      // 文本实例\添加
      const gTextStyle = new gDBox.Style({
        fontColor: "#0000FF",
        strokeColor: "#0000FF",
        opacity: 0
      });
      this_.text = new gDBox.Text(
        `text-${id}`,
        {
          pos: { x: points[0].x, y: points[0].y },
          offset: { x: 5, y: 5 },
          width: 100, // maxwidth
          text: name
        },
        gTextStyle
      );
      this_.gTextLayer.addText(this_.text);
      this_.watchGeometryEditing(this_.gTextLayer);
    },

    // 双击标注时增加叉选按钮
    adddelMarkerBtn(imgUrl) {
      const this_ = this;
      this_.gMap.events.on("featureSelected", function(feature) {
        let cFeature = feature;
        // 删除按钮添加
        const featureBounds = cFeature.getBounds();
        const leftTopPoint = featureBounds[0]; // 边界坐上角坐标
        let deleteMarker = new gDBox.Marker(`marker-${cFeature.id}`, {
          src: imgUrl,
          x: leftTopPoint.x,
          y: leftTopPoint.y,
          offset: {
            x: 0,
            y: 0
          },
          featureId: cFeature.id
        });
        this_.gMap.mLayer.addMarker(deleteMarker);

        deleteMarker.regEvent("click", function() {
          // 执行选中元素删除
          gFeatureLayer.removeFeatureById(this.info.featureId);
          // 对应删除标注层中删除（x）icon
          this_.gMap.mLayer.removeAllMarkers();
        });
      });
    },

    // 监听绘图编辑事件
    watchGeometryEditing(gTextLayer) {
      const this_ = this;
      this_.gMap.events.on("geometryEditing", function(
        type,
        feature,
        newPoints
      ) {
        if (!this_.gMap.mLayer) return;
        const bounds = gDBox.Util.getBounds(newPoints);

        const updateText = gTextLayer.getTextById(`text-${feature.id}`);

        updateText.update({
          pos: {
            x: bounds[0].x,
            y: bounds[0].y
          }
        });

        // const marker = new gDBox.Marker(feature.id, {
        //   src: this_.base64,
        //   x: bounds[0].x,
        //   y: bounds[0].y,
        //   offset:{
        //     x:0,
        //     y:0
        //   }
        // })
        // this_.gMap.mLayer.addMarker(marker)
        // this_.gMap.mLayer.removeMarkerById(feature.id);
        // const markerObj = this_.gMap.mLayer.getMarkerById(feature.id)
        // if (!marker) return

        // // 边界左上角坐标
        // const leftTopPoint = bounds[0]
        // marker.update({x: leftTopPoint.x, y: leftTopPoint.y})

        // // 标注跟随移动
        // const rightTopPoint = bounds[1]
        // const comment = gTextLayer.getTextId('comment' + feature.data.num)
        // comment.update({pos:{x: rightTopPoint.x, y: rightTopPoint.y + 24}})
        // // 文字跟随系统
        // const rightBottom = bounds[2]
        // const leftBottom = bounds[3]
        // const text = gTextLayer.getTextById(feature.data.num)
        // text.update({pos: {x: (rightBottom.x + leftBottom.x) / 2 -15, y: rightBottom.y}})
      });
    },

    // 删除所有文本
    delAllText() {
      this.gTextLayer.removeAllTexts();
    },

    // 设置绘画模式
    setMode(mode) {
      this.gMap.setMode(mode);
    },

    // 设置图片
    setImage(base64, objectList, w, h) {
      // console.log('objectList====pre', objectList)
      // 容器对象声明
      this.gMap = new gDBox.Map("containId", {
        zoom: 1080,
        cx: 0,
        cy: 0,
        zoomMax: 1080 * 10,
        zoomMin: 1080 / 10
      });

      let gImageLayer = new gDBox.Layer.Image(
        "img",
        base64,
        {
          w: w,
          h: h
        },
        { zIndex: 1 }
      );
      this.gMap.addLayer(gImageLayer);
      // 'map': 浏览模式
      //'drawRect': 矩形绘制
      //'drawPolygon': 多边形绘制
      this.gMap.setMode("map");
      // 绘画框矢量层实例\添加
      this.gFeatureLayer = new gDBox.Layer.Feature(
        "d65244d3064e4b5183624191d008cdb7",
        {
          zIndex: 2,
          transparent: false
        }
      );
      this.gMap.addLayer(this.gFeatureLayer);
      this.setStrokeColor("#145b7d");
      // 设置 标注
      if (objectList!= null && objectList.gdbis) {
        for (let i = 0; i < objectList.gdbis.length; i++) {
          var object = objectList.gdbis[i];
          // console.log('object>>>>==', object)
          var fea = new gDBox.Feature.Polygon(
            object.id,
            object.points,
            object.data,
            object.style
          );
          this.gFeatureLayer.addFeature(fea);
        }
      }

      this.gMap.events.on("geometryEditDone", (type, activeFeature, points) => {
        activeFeature.update({ points });
        activeFeature.show();
      });
      
      // 添加文字标注层
      const gTextStyle = new gDBox.Style({
        fontColor: "#0000FF",
        strokeColor: "#0000FF",
        opacity: 0
      });
      this.gTextLayer = new gDBox.Layer.Text("textLayer", { zIndex: 2 });
      this.gMap.addLayer(this.gTextLayer);
      if (objectList != null && objectList.textInfo != null) {
        objectList.textInfo.forEach(item => {
          // console.log('item++++', item)
          let textItem = new gDBox.Text(item.id, item.config, gTextStyle)
          this.gTextLayer.addText(textItem)
        })
      }
    },

    // 获取图片
    initData(objectList) {
      const this_ = this
      if (this_.$route.query.data) {
        this_.labelGroupId = this_.$route.query.data.labelGroupId
        this_.jobName = this_.$route.query.data.jobName;
        this_.id = this_.$route.query.data.id;
        this_.jobType = this_.$route.query.data.jobType;
        this_.jobStatus = this_.$route.query.data.jobStatus;
        this_.remarkType = this_.$route.query.data.remarkType;
        this_.usersid = this_.$route.query.data.users;
        // if (this_.jobType == '2') {
        //   this_.pageIndex = this_.$route.query.pageIndex
        //   console.log('this_.pageindex====', this_.$route.query.pageIndex)
        // }
        if (this_.role === '1') {
          this_.adminUserId = this_.$route.query.userId; // 管理员角色下的人员id
        } else {
          this_.ordinaryUserId = JSON.parse(this_.$route.query.data.users).userid // 普通用户点击任务时获取该用户的id
        }
      } else {
        this_.labelGroupId = ''
        this_.jobName = "";
        this_.id = "";
        this_.jobType = "";
        this_.base64 = "";
        this_.imgId = "";
        this_.totalPageNum = "";
        this_.labelprice = "";
        this_.labelName = "";
        this_.remarkType = "";
        this_.remarkPoints = "";
        this_.usersid = "";
        this_.userId = "";
        this_.imageSuat = "";
        this_.setImage(null);
        return;
      }
      if (this_.id) {
        const params = {
          jobID: this_.id,
          jobType: this_.jobType,
          pageIndex: this_.pageIndex,
          pageSize: 1,
          user: this_.adminUserId ? this_.adminUserId : this_.ordinaryUserId, // 当前用户的id
          curUserId: this_.userid  // 当前账号的id
        }
        // 标注
        if (this_.jobType === "2") {
          params.imageStatus = "0";
        } else if (this_.jobType === "3") {
          params.imageStatus = "1";
        }
        this.$axios({
          method: "post",
          url: "/job/getImgeList",
          data: params
        }).then(res => {
          console.log('res===', res.data)
          this_.totalPageNum = res.data[0].total
          this_.restPages = res.data[1]
          if (res && res.data[0] && res.data[0].list[0] && res.data[0].list[0].imageName) {
            this_.imageName = res.data[0].list[0].imageName
          }
          if (res.data[0].total > 0) {
            const data = {
              imageId: res.data[0].list[0].id,
              jobId: this_.id
            };
            this_.imageSuat = res.data[0].list[0].status;
            if (this.$store.state.auth.limitsOfauthority == 1) {
              data.userId = 1;
            }
            this_.labelName = res.data[0].list[0].label;
            if (res.data[0].list[0].remarkPoints) {
              this_.remarkPoints = res.data[0].list[0].remarkPoints;
              objectList = JSON.parse(res.data[0].list[0].remarkPoints);
            }
            this.$axios({
              method: "post",
              url: "/job/getBase64Images",
              data: data
            }).then(res => {
              this_.base64 = "data:image/jpeg;base64," + res.data.image;
              this_.imgId = res.data.imageID;
              this_.labelprice = res.data.label;
              // console.log('res.data+++++++89898', res.data)
              this_.rejectAdcice = res.data.rejectDesc
              // console.log('this_.rejectAdcice+++++++', this_.rejectAdcice)
              var w = res.data.w;
              var h = res.data.h;
              this_.setImage(this_.base64, objectList, w, h);
              // this_.adddelMarkerBtn(this_.base64)
            });
          } else {
            this_.id = "";
            this_.jobType = "";
            this_.base64 = "";
            this_.imgId = "";
            this_.labelprice = "";
            this_.labelName = "";
            this_.remarkType = "";
            this_.remarkPoints = "";
            this_.usersid = "";
            this_.setImage(null);
          }
        })
      }
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    }
  },

  computed: {
    role() {
      return this.$store.state.auth.limitsOfauthority
    }
  },

  components: {
    adminCheck,
    signCheck,
    cleaner,
    // checker,
    auditCleaning,
    auditMarking
  }
}
</script>

<style scoped lang="stylus">
.myWorkContent {
  position: absolute;
  left: 0;
  top: 61px;
  width: 100vw;
  height: calc(100vh - 63px);
}

.leftContent {
  position: absolute;
  left: 10px;
  top: 0;
  width: 70%;
  height: 100%;
}

// border:1px solid #d4d4d4
.upload-demo {
  text-align: center;
  margin: 10px auto;
  width: 50%;
}

.leftField {
  border-radius: 3px;
  height: 70%;
  width: 95%;
  background: #F0F0F0;
}

.rightcontent {
  position: absolute;
  right: 10px;
  top: 0;
  width: 29%;
  height: 100%;
}

// border:1px solid #d4d4d4
.rightField {
  border-radius: 3px;
  height: 70%;
  background: #F0F0F0;
}

.btnBox {
  text-align: center;
}

.boxBtns {
  width: 100px;
  margin: 20px 20px;
}

.boxBtns.markBtn {
  width: 200px;
  margin: 20px;
}

.taskInfo {
  color: #606266;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 15px;
  margin-bottom: 10px;
  width: 200px;
}

#containId {
  width: calc(100% - 30px); // 必须
  height: calc(100% - 30px); // 必须
  border: 1px solid red;
  position: relative;
  cursor: crosshair;
  -moz-user-select: none; /* 火狐 */
  -webkit-user-select: none; /* webkit浏览器 */
  -ms-user-select: none; /* IE10 */
  -khtml-user-select: none; /* 早期浏览器 */
  user-select: none;
}

.taskname-lastpages {
  display: flex;
  justify-content: center;
}

.uploadFile {
  width: 100%;
  display: flex;
  justify-content: center;
}

.boxBtns.markBtn {
  width: 120px;
  text-align: center;
}

.dialogZindex {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 99999;
}
</style>
