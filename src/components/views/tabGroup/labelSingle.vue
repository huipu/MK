<template>
    <div class="labelSingleContent">
        <div>
            <el-row class="createdSample">
                <!-- <el-col :span="5">
                    <el-input v-model="createSampleTypeValue" placeholder="请输入样本类别(中)" style="width:200px;margin-bottom:10px;" size="small" clearable></el-input>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="createSampleTypeValueEn" placeholder="请输入样本类别(英)" style="width:200px;" size="small" clearable></el-input>
                </el-col> -->
                <el-col :span="3">
                    <el-button type="primary" size="small" @click="createdLabelBtn">新建标签</el-button>
                    <el-dialog title="新建标签" :visible.sync="dialogFormVisible" width="300px">
                        <el-input v-model="createSampleTypeValue" placeholder="请输入样本类别(中)" style="width:200px;margin-bottom:10px;" size="small"></el-input>
                        <el-input v-model="createSampleTypeValueEn" placeholder="请输入样本类别(英)" style="width:200px;" size="small"></el-input>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                            <el-button type="primary" @click="sureBtn" size="small">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-col>
            </el-row>
            <el-table
                :data="tableData"
                :header-cell-style="tableHeaderColor"
                :cell-style="tableRowStyle"
                border
                style="width: 800px">
                <el-table-column
                fixed
                prop="createtime"
                label="日期"
                width="180px">
                </el-table-column>
                <el-table-column
                prop="chLabel"
                label="标签名(中)"
                width="200px">
                </el-table-column>
                <el-table-column
                prop="enLabel"
                label="标签名(英)"
                width="200px">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="*">
                <template slot-scope="scope">
                    <el-button @click="editLabel(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="delLabel(scope.row)">删除</el-button>
                </template>
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

            <el-dialog title="编辑标签" :visible.sync="dialogLabelVisible" width="300px">
                <el-input v-model="editSampleTypeValue" placeholder="请输入样本类别(中)" style="width:200px;margin-bottom:10px;" clearable size="small"></el-input>
                <el-input v-model="editSampleTypeValueEn" placeholder="请输入样本类别(英)" style="width:200px;" clearable size="small"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogLabelVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="editSureBtn()" size="small">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                editDialogRow: '',
                dialogLabelVisible: false,
                dialogFormVisible: false,
                curPageIndex: 1,
                curPageSize: 10,
                curTotalPages: 0,
                createSampleTypeValue: '',
                createSampleTypeValueEn: '',
                editSampleTypeValue: '',
                editSampleTypeValueEn: '',
                groupLists: [],
                tableData: []
            }
        },
        props: ['groupId'],
        methods: {
            // 删除标签
            delLabel (row) {
                this.$confirm(`请确认是否删除标签---${row.chLabel}`, '删除标签', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.$axios({
                            method: 'post',
                            url: '/label/delLabel',
                            data: {id: row.id}
                        })
                        .then(res => {
                            // console.log('res_+_+_+', res)
                            this.getGroupList ()
                            this.$message('删除标签成功')
                        })
                })
            },
            // 编辑标签
            editLabel (row) {
                console.log('row====', row)
                this.editDialogRow = row
                this.dialogLabelVisible = true
                this.editSampleTypeValue = row.chLabel
                this.editSampleTypeValueEn = row.enLabel
            },
            editSureBtn () {
                console.log('this.editDialogRow====', this.editDialogRow)
                let params = {
                    "chLabel": this.editSampleTypeValue,
                    "enLabel": this.editSampleTypeValueEn,
                    "groupId": this.editDialogRow.groupId,
                    "id": this.editDialogRow.id
                }
                this.$axios({
                    method: 'post',
                    url: '/label/editLabel',
                    data: params
                })
                .then(res => {
                    this.dialogLabelVisible = false
                    this.getGroupList ()
                })
            },
            // 分页
            curPageChange (val) {
                this.curPageIndex = val
                this.getGroupList ()
            },
            curhandleSizeChange (val) {
                this.curPageSize = val
                this.getGroupList ()
            },
            createdLabelBtn () {
                if (!this.$parent.selectedLabelId) {
                    this.$message.error('请先选择左侧的标签组')
                    return
                }
                this.dialogFormVisible = true
            },
            // 表格样式
            tableHeaderColor({row,column,rowIndex,columnIndex}) {
                return 'background-color:#66B1FF;color:#fff;font-size:16px;text-align:center'
            },
            tableRowStyle({row,rowIndex}) {
                return 'text-align:center'
            },
            // 创建标签
            sureBtn () {
                if (this.createSampleTypeValue === '' || this.createSampleTypeValueEn === '') {
                    this.$message.error('样本名不可为空')
                    return
                }
                let params = {
                    "chLabel": this.createSampleTypeValue,
                    "enLabel": this.createSampleTypeValueEn,
                    "groupId": this.groupId,
                    "id": ''
                }
                this.$axios({
                    method: 'post',
                    url: '/label/addLabel',
                    data: params
                })
                .then(res => {
                    this.$message(res.data.msg)
                    this.dialogFormVisible = false
                    this.createSampleTypeValue = ''
                    this.createSampleTypeValueEn = ''
                    this.getGroupList ()

                })
            },
            // 获取标签列表
            getGroupList () {
                let params = {
                    "groupId": this.groupId,
                    "pageIndex": this.curPageIndex,
                    "pageSize": this.curPageSize
                }
                this.$axios({
                    method: 'post',
                    url: '/label/getLabelList',
                    data: params
                })
                .then(res => {
                    console.log('res===22', res)
                    this.tableData = res.data.list
                    this.curTotalPages = res.data.total
                })
            }
        },
        watch: {
            groupId: function (nv, ov) {
                this.groupId = nv
                this.getGroupList ()
            }
        }
    }
</script>
<style scoped lang="stylus">
.labelSingleContent
    display:flex
    justify-content:center
    // .groupLists
    //     display:flex
    //     justify-content:center
    //     width:100%
    //     height:800px
    .createdSample
        display:flex
        justify-content :flex-start
        margin: 50px 0 10px 0
    .createdText
        color: #303133
        font-size: 20px
        margin: 20px 0 20px 20px
    .splitLine
        border: 1px solid #d4d4d4   
</style>
