<template>
    <div class="tabGroup">
        <div class="contentLeft">
            <el-row style="border-bottom:1px solid #d4d4d4;margin:20px 0 0 0;display:flex;justify-content:center;">
                <div style="margin-bottom:2px;">创建标签组</div>
            </el-row>
            <el-row class="createdRow">
                <el-input v-model="newLabel" placeholder="创建新增标签组" clearable class="createdInput" size="small">创建标签分组</el-input>
            </el-row>
            <el-row class="sureRow">
                <el-button type="primary" size="small" style="width:60px;margin:10px 0;" @click="newLabelCreate()">确定</el-button>
            </el-row>
            <el-row style="border-bottom:1px solid #d4d4d4;display:flex;justify-content:center;">
                <div style="margin-bottom:2px;">标签组名</div>
            </el-row>
            <div class="groupContent">
                <el-row v-for="(item, key) in labelOptions" :key="key" class="groupLabel">
                    <el-button type="warning" plain class="groupLabelBtn" size="small" :class="{clickClass: isClickClass === item.id}" @click="labelRow(item)">{{item.groupname}}</el-button>
                </el-row>
            <!-- </div> -->
            <el-row class="delGroupLabel">
                <el-col :span="12" class="labelCol">
                    <el-button v-if="ifShowDelBtn" type="primary" class="delBtn" size="small" @click="editLabelRow()">编辑标签组</el-button>
                </el-col>
                <el-col :span="12" class="labelCol">
                    <el-button v-if="ifShowDelBtn" type="primary" class="delBtn" size="small" @click="delLabelRow()">删除标签组</el-button>
                </el-col>
            </el-row>
            </div>
        </div>
        <div class="contentRight">
            <lableSingle :groupId="selectedLabelId"></lableSingle>
        </div>

        <el-dialog title="编辑标签组" :visible.sync="dialogLabelVisible" width="300px">
            <el-input v-model="editSampleTypeValue" style="width:200px;margin-bottom:10px;" clearable size="small"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogLabelVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editSureBtn()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import lableSingle from './labelSingle'
export default {
    data () {
        return {
            editSampleTypeValue: '',
            dialogLabelVisible: false,
            selectedLabelName: '',
            isClickClass: false,
            ifShowDelBtn: false,
            newLabel: '',
            selectedLabelId: -1,
            labelOptions: []
        }
    },
    methods: {
        // 编辑标签组
        editLabelRow () {
            if (this.selectedLabelId === -1 || this.selectedLabelId == undefined) {
                this.$message.error('请先选择标签组')
                return
            }
            this.dialogLabelVisible = true
            this.editSampleTypeValue = this.selectedLabelName
        },
        editSureBtn () {
            let params = {
                "groupname": this.editSampleTypeValue,
	            "id": this.selectedLabelId
            }
            this.$axios({
                method: 'post',
                url: '/label/editLabelGroup',
                data: params
            })
            .then(res => {
                // this.editSampleTypeValue = ''
                this.dialogLabelVisible = false
                this.getLableGroup ()
                this.selectedLabelId = -1
                this.isClickClass = ''
            })
        },
        // 创建标签组
        newLabelCreate () {
            if (this.newLabel === '') {
                return this.$message.error('标签分组名不可为空')
            }
            let params = {
                groupname: this.newLabel,
                id: ''
            }
            this.$axios({
                method: 'post',
                url: '/label/addLabelGroup',
                data: params
            })
            .then(res => {
                // console.log('res===1', res)
                this.getLableGroup ()
                this.$message('新增标签组成功！')
                this.newLabel = ''
            })
            
        },
        //选中当前标签组
        labelRow (label) {
            this.selectedLabelId = label.id
            // console.log('this.selectedLabelId===', this.selectedLabelId)
            this.selectedLabelName = label.groupname
            this.labelOptions.forEach(item => {
                if (item.id === label.id ) {
                    this.isClickClass = label.id
                }
            })
        },
        // 删除选中的标签组
        delLabelRow () {
            if (this.selectedLabelId === -1) {
                this.$message.error('请选择标签组')
                return
            }
            this.$confirm(`确认删除标签组---${this.selectedLabelName}`, '删除标签组', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let params = {
                    id: this.selectedLabelId,
                }
                this.$axios({
                    method: 'post',
                    url: '/label/delLabelGroup',
                    data: params
                })
                .then(res =>{
                    this.$message(res.data.msg)
                    this.getLableGroup ()
                    this.selectedLabelName = ''
                    this.selectedLabelId = -1
                })
            })
        },
        // 获取标签组
        getLableGroup () {
            this.$axios({
                method: 'post',
                url: '/label/getLabelTree',
                data: ''
            })
            .then(res =>{
                // console.log('res++++', res)
                this.labelOptions = res.data
            })
        }
    },
    created () {
        this.getLableGroup ()
        if ( this.labelOptions.length != 0) {
            this.ifShowDelBtn = true
        } else {
            this.ifShowDelBtn = false
        }
    },
    watch: {
        labelOptions: function (nv, ov) {
            if (nv.length != 0) {
                this.ifShowDelBtn = true
            }else {
                this.ifShowDelBtn = false
            }
        }
    },
    components: {
        lableSingle
    }

}
</script>

<style lang="stylus" scoped>
.tabGroup
    display: flex
    $contentLeftWidth = 220px
    .contentLeft
        width: $contentLeftWidth
        height: calc( 100vh - 62px)
        border-right:1px solid #d4d4d4
        .labelCol
            display:flex
            justify-content :center
        .sureRow
            display:flex;
            justify-content: center;
            // border-bottom:1px solid #d4d4d4;
            margin-bottom:20px;
        .createdRow
            margin-top:15px
            width:$contentLeftWidth
            display:flex
            justify-content :center
            .createdInput
                width: 160px
        .groupLabel
            display:flex
            justify-content : center
            width: 100%
            .clickClass
                background-color: #E6A23C;
                color: #ffffff
            .groupLabelBtn
                width:160px
                margin:5px 0
                white-space: normal
                word-wrap: break-word
                word-break: break-all
        .delGroupLabel
            display:flex
            justify-content : center
            width:100%
            margin-top: 10px
    .contentRight
        width: 100%
        height: calc( 100vh - 62px)
        color:red
    .groupContent
        padding: 15px 0 15px 0;
        height: calc(100vh - 280px)
        overflow: auto    
    ::-webkit-scrollbar {
        width:3px;
        background-color: #d4d4d4
        // #fff
        // #E6A23C;
    }
    ::-webkit-scrollbar-track {
        border-radius:3px;
        }
    ::-webkit-scrollbar-thumb {
        border-radius:8px;
        background: #E6A23C;
        }  
</style>
