<template>
    <div class="authCoontent">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            >
            <el-menu-item index="7-0" @click="selectAllAuth()" :style="selectAllAuthActive">
                <i class="el-icon-setting" ></i>
                <span slot="title">查看所有权限</span>
            </el-menu-item>
            <el-menu-item index="7-1" @click="addAuth()" :style="addAuthActive">
                <i class="el-icon-document-add"></i>
                <span slot="title">添加权限</span>
            </el-menu-item>
        </el-menu>
        <div class="rightContent">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive">
                    <!-- 这里是会被缓存的视图组件 -->
                </router-view>
            </keep-alive>

            <router-view v-if="!$route.meta.keepAlive">
                <!-- 这里是不被缓存的视图组件 -->
            </router-view>
        </div>
    </div>
</template>
<script>
import getActiveNav from '../../../utils/navConfig.js'
export default {
    data() {
        return {
            activeIndex: '6-0',
            selectAllAuthActive: '',
            addAuthActive: '',
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        },
        addAuth() {
            this.$router.push('/home/auth/addAuth')
        },
        selectAllAuth() {
            this.$router.push('/home/auth/')
        },
    },
    mounted () {
        this.activeIndex = getActiveNav.getActiveChildNav(window.location.href)
        // console.log('window.location.href==',window.location.href)
        // console.log('this.activeIndex==', this.activeIndex)
    },
    watch: {
        '$route.path': function(nv, ov) {
            if ((ov === '/home/auth/' && nv === '/home/auth/addAuth') || (ov === '/home/auth' && nv === '/home/auth/addAuth')) {
                this.selectAllAuthActive = {color: '#303133'}
                this.addAuthActive = {color: '#409EFF'}
            }else if ((ov === '/home/auth/addAuth' && nv === '/home/auth/') || (ov === '/home/auth/addAuth' && nv === '/home/auth')) {
                this.selectAllAuthActive = {color: '#409EFF'}
                this.addAuthActive = {color: '#303133'}
            }else {
                this.selectAllAuthActive = {}
                this.addAuthActive = {}
            }
        }
    }
    
}
</script>
<style scoped lang="stylus">
.el-menu-vertical-demo
    position:absolute
    left:0
    top:61px
    bottom:0
    width:12%
    height:calc(100vh - 61px)
    border-right:1px solid #d4d4d4
    .el-icon-document-add
        color: inherit    
.rightContent
    position:absolute
    left:12%
    top:61px
    bottom:0
    width:88%
</style>