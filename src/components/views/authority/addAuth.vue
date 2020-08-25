<template>
    <div class="addAuthContent">
        <div class="topContent">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="2" class="anthEdit"><div class="grid-content bg-purple">用户名：</div></el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-input
                            :disabled="true"
                            v-model="username">
                        </el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="2" class="anthEdit"><div class="grid-content bg-purple">权限设置：</div></el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-select v-model="authValue" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>

            <el-row type="flex" class="row-bg row-bg-btn" justify="center">
                <el-col :span="1.5" class="firmBtn">
                    <!-- <div class="grid-content bg-purple"> -->
                        <el-button type="primary" size="small" @click="saveSure">确定</el-button>
                    <!-- </div> -->
                </el-col>
                <el-col :span="1.5">
                    <!-- <div class="grid-content bg-purple"> -->
                         <el-button type="primary" size="small" @click="cancle">取消</el-button>
                    <!-- </div> -->
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                 options: [{
                    value: '1',
                    label: '管理员'
                    }, {
                    value: '2',
                    label: '普通操作员'
                    }],
                authValue: this.$route.query ? this.$route.query.usertype : '',
                username: this.$route.query ? this.$route.query.name : ''
            }
        },
        props:[
            //  'plan'
        ],
        created () {
            // let nameNum = this.$route.query
            // console.log('nameNum===', nameNum)
        },
        methods: {
            saveSure () {
                let params =  {
                        "email": "",
                        "nickname": "",
                        "phoneNum": "",
                        "username": this.username,
                        "workID": '',
                        "usertype": this.authValue
                          }
                this.$axios({
                        method:'post',
                        url:'/user/edit',
                        data: params
                    })
                .then((res) =>{
                    // console.log('res===++--===',res)
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'success'
                    });
                })
                .catch((err) =>{
                    console.log('err==',err)
                })
            },
            cancle () {
                this.authValue = this.$route.query ? this.$route.query.usertype : ''
            }
        },
        computed: {
            // nameNum: function () {
            //     console.log('hahahha===', nameNum)
            // }
        },
        watch: {
            '$route.path' (to, from) {
                console.log('routerchange==-------',to,'---', from)
                let info = this.$route.query
                // console.log('info=====', info)
                if (info && info.name && info.usertype) {
                    this.username = info.name
                    this.authValue = info.usertype
                } else {
                    this.username = ''
                    this.authValue = ''
                }
            }
        }
    }
</script>
<style  scoped lang="stylus">
.topContent
    border: 1px solid #D4D4D4
    border-radius: 8px
    margin: 20px
    height: 45vh
    padding:20vh
    .el-col
        display:flex
        align-items:center
    .firmBtn
        margin-right:20px
    // .row-bg-btn
    //     margin-top:10%      
.row-bg.el-row.is-justify-center.el-row--flex
    margin-top:10px
.anthEdit
    display:flex
    justify-content: flex-end
</style>