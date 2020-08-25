<template>
    <div class="compressContent">
        <el-row class="rowhandle">
            <el-col :span="8" style="margin: 0 10px 5px 0">
            <el-select v-model="searchCompressPack" placeholder="请筛选资源集名" size="small" clearable @visible-change="dropDownShow" @change="searchCompPack()">
                <el-option
                v-for="item in compressOptions"
                :key="item.id"
                :label="item.instancename"
                :value="item.instancename">
                </el-option>
            </el-select>
            </el-col>
        </el-row>
        <el-table
            :header-cell-style="tableHeaderColor"
            :cell-style="tableRowStyle"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <!-- <el-table-column
            type="selection"
            width="55"
            center>
            </el-table-column> -->
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
            prop="instanceName"
            label="资源集名"
            width="200"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="压缩操作"
                width="200">
                <template slot-scope="scope">
                    <el-button type="text" @click="compressBtn(scope.row)">压缩</el-button>
                </template>
            </el-table-column>
            
        </el-table>
        <el-row class="bottomRow">
            <el-col :span="12">
                <el-button type="primary" size="small" @click="toggle()">切换为导出
                </el-button>
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
            <!-- <el-progress v-if="IsProgressBar" :percentage="IsProgressBar"></el-progress> -->
            </el-col>
        </el-row>
        <el-dialog
            title="选择压缩格式"
            :visible.sync="dialogVisible"
            width="20%">
            <el-radio v-model="type" label="0">json文件</el-radio>
            <el-radio v-model="type" label="1">xml文件</el-radio>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false" size="small">取 消</el-button>
                <el-button type="primary" @click="sureBtn()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            instanceNameParam: '',
            searchCompressPack: '',
            compressOptions: [],
            currentPages: 1,
            pageSizeLimit: 10,
            taskPageTotal: 0,
            tableData: [],
            type: '0',
            dialogVisible: false,
            compressId: '',
        }
    },
    props:{
        isShow: String
    },
    created () {
        this.getToZipList ()
    },
    methods: {
        //下拉时触发
        dropDownShow (val) {
            if (val === false) return
            // console.log('val-=-=-==', val)
            this.compressOptions = this.$parent.livingList
            // console.log('this.compressOptions===', this.compressOptions)
        },
        // 确认压缩
        sureBtn () {
            let params = {
                "instanceId": this.compressId,
			    "type": this.type
            }
            this.$axios({
                method: 'post',
                url: '/exportZip/compress',
                data: params
            })
            .then(res => {
                this.dialogVisible = false

            })
        },
        // 切换
        toggle () {
            this.$parent.isShow = 'export'
            this.$parent.getExportZipList ()
        },
        // 分页
        handleSizeChange (val) {
            this.pageSizeLimit = val
            this.getToZipList ()
        },
        handleCurrentChange (val) {
            this.currentPages = val
            this.getToZipList ()
        },
        // 压缩
        compressBtn (row) {
            this.dialogVisible = true
            this.compressId = row.id
        },
        searchCompPack () {
        //    console.log('this.searchCompressPack===', this.searchCompressPack)
           this.currentPages = 1
           this.getToZipList ()
        },
        // 获取表格数据
        getToZipList () {
            let params = {
                "pageIndex": this.currentPages,
                "pageSize": this.pageSizeLimit,
                "instanceName": this.searchCompressPack
            }
            this.$axios({
                method: 'post',
                url: '/exportZip/getToZipList',
                data: params
            })
            .then(res=> {
                // console.log("thisres+++_+_+_=", res)
                this.tableData = res.data.list
                this.taskPageTotal = res.data.total
            })
        },
        // 表格样式
        tableHeaderColor ({row, column, rowIndex, columnIndex}) {
            return 'background-color:#66B1FF;color:#fff;font-size:16px;text-align:center'
        },
        tableRowStyle ({row, rowIndex}) {
            return 'text-align:center'
        },
    }
}
</script>
<style scoped lang="stylus">
    .bottomRow
        margin-top: 10px
</style>