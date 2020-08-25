<template>
    <div class="selectAuth">
        <div>
            <el-row class="rowhandle">
                <el-col :span="6">
                    <el-input
                        clearable
                        size="small"
                        placeholder="请输入姓名查询"
                        prefix-icon="el-icon-search"
                        v-model="nameSearch">
                        <!-- @keyup.enter.native="nameSearchEnter()" -->
                    </el-input>
                </el-col>
                <el-col :span="5" style="margin: 0 10px 5px">
                    <el-select v-model="authValue" placeholder="请筛选权限级别" size="small" clearable @change="selectAuthLevel">
                        <el-option
                            v-for="item in authOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input
                        clearable
                        size="small"
                        placeholder="请输入工号查询"
                        prefix-icon="el-icon-search"
                        v-model="IDSearch">
                        <!-- @keyup.enter.native="IDSearchEnter()" -->
                    </el-input>
                </el-col>
            </el-row>
            
            <el-table
                :header-cell-style="tableHeaderColor"
                :cell-style="tableRowStyle"
                :data="tableData"
                border
                style="width: 681px;">
                <!-- <el-table-column
                    fixed
                    prop="date"
                    label="日期"
                    width="150">
                </el-table-column> -->
                <el-table-column
                    prop="nickname"
                    label="姓名"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="username"
                    label="用户名"
                    width="120">
                    </el-table-column>
                <el-table-column
                    prop="userLever"
                    label="权限级别"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="userNo"
                    label="工号"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="float:right;margin-top:10px;"
                :pager-count="5"
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
import _ from 'lodash'
export default {
    name: 'selectAllAuth',
    data() {
      return {
          userNo: '',
          nickname: '',
          userNo: '',
          usertype: '',
          pageSizeLimit: 10,
          currentPages: 1,
          taskPageTotal: 0,
          IDSearch: '',
          authValue: '',
          nameSearch: '',
          authOptions: [{
                value: '1',
                label: '管理员权限'
            },
            {
                value: '2',
                label: '普通权限'
            }],
            tableData: []
        }
    }, 
    methods: {
        // IDSearchEnter () {
        //     this.userNo = this.IDSearch
        //     this.getTableData()
        // },
        selectAuthLevel () {
            this.usertype = this.authValue
            this.getTableData()
        },
        handleSizeChange (val) {
            this.pageSizeLimit = val
            this.getTableData()
        },
        currentChange (val) {
            this.currentPages = val
            this.getTableData()
        },

        tableHeaderColor({row,column,rowIndex,columnIndex}) {
                return 'background-color:#66B1FF;color:#fff;font-size:16px;text-align:center'
            },

        tableRowStyle({row,rowIndex}){
            return 'text-align:center'
        },

        handleDelete(row) {
            // console.log('row===', row.userid)
            this.$confirm(`是否删除员工---${row.nickname}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                    let params = {
                        userId: row.userid
                    }
                    this.$axios({
                        method: 'post',
                        url: '/user/dropUser',
                        data: params
                    })
                    .then((res)=>{
                        // console.log('res+++123', res)
                        this.$message(res.data.msg)
                        this.getTableData()
                    })
                }
            )
            // .catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     });          
            // });
        },

        handleEdit(row) {
            // console.log('row===', row)
            this.$router.push({ path: '/home/auth/addAuth', query: {name: row.username, usertype: row.usertype }})
        },

        getTableData () {
            let params = {
                "nickname": this.nickname,
                "pageIndex": this.currentPages,
                "pageSize":  this.pageSizeLimit,
                "userNo": this.userNo,
                "usertype": this.usertype
            }
            this.$axios({
                method: 'post',
                url: '/user/getUserList',
                data: params
            })
            .then((res) =>{
                console.log('res==>>>', res)
                this.taskPageTotal = res.data.total
                // console.log('this.taskPageTotal==', this.taskPageTotal)
                let tableHandle = []
                res.data.list.forEach((item,key) => {
                    item.userLever = item.usertype === '1' ? '管理员' : '普通操作员'
                    tableHandle.push(item)
                })
                this.tableData = tableHandle
            })
            .catch((err) =>{
                // console.log('err==',err)
            })
        },
    },

    created: function () {
        this.getTableData()
        this.searchData = _.debounce( this.getTableData, 500)
    },

    watch: {
        nameSearch: function (nv,ov) {
            this.nickname = nv
            this.currentPages = 1
            this.searchData()
        },
        IDSearch: function(nv, ov) {
            this.userNo = nv
            this.currentPages = 1
            this.searchData()
        }
    }
}

</script>
<style scoped lang="stylus">
.selectAuth
    // border: 1px solid #D4D4D4
    // border-radius: 8px
    margin: 50px
    // height: 80vh
    // padding-top:1%
    text-align:center
    display:flex
    justify-content:center
.rowhandle
    display: flex
    justify-content :flex-start    
</style>