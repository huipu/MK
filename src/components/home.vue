<template>
  <div class="homeContent">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="0" @click="fristPage()">
        <img src="../assets/nariLogo.png" style="width:140px;height:61px;">
      </el-menu-item>
      <el-menu-item index="1" @click="fristPage()">首页</el-menu-item>
      <el-menu-item index="2" v-if="limitsOfauthority" :style="setWorkColor" @click="myWork()">我的工作台</el-menu-item>
      <el-menu-item index="3" v-if="limitsOfauthority !== '1'" :style="setTaskColor" @click="myTask()">我的任务</el-menu-item>
      <el-menu-item index="4" v-if="(limitsOfauthority === '1')" :style="setAllotTaskColor" @click="allotTask()">任务分配</el-menu-item>
      <el-menu-item index="5" v-if="(limitsOfauthority === '1')" @click="fileHandel()">数据整理</el-menu-item>
      <el-menu-item index="6" v-if="(limitsOfauthority === '1')" @click="tabGroup()">标签分组</el-menu-item>
      <el-menu-item index="7" v-if="(limitsOfauthority === '1')" @click="auth()">权限管理</el-menu-item>
      <el-menu-item index="8" class="handleExit" style="float:right;" @click="exit()"><i class="el-icon-lightning"></i>退出登录</el-menu-item>
      <div :class="{ 'loginInfo': isActive }" style="float:right;">
        <div class="iconUser"><i class="el-icon-user"></i></div>
        <div class="userText">{{username}}</div>
      </div>
    </el-menu>
    
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
            <!-- 这里是会被缓存的视图组件 -->
        </router-view>
    </keep-alive>

    <router-view>
        <!-- 这里是不被缓存的视图组件 -->
    </router-view>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import getActiveNav from '../utils/navConfig.js'

  export default {
    data () {
      return {
        setWorkColor: '',
        setTaskColor: '',
        setAllotTaskColor: '',
        activeIndex: '1',
        // limitsOfauthority: '2',
        myworkspace: 1,
        isActive: true
      }
    },

    methods: {
      // 标签分组
      tabGroup () {
        this.$router.push('/home/tabGroup')
      },
      handleSelect (key, keyPath) {
        // this.index=1

      },
      fristPage () {
        this.$router.push('/home/fristPage')
      },
      auth () {
        this.$router.push('/home/auth')
        // this.$router.push('/home/auth/addAuth')
      },
      exit () {
        // this.$store.commit()
        // this.$store.commit("auth/setLoginAuth", 0)
        // console.log('90909')
        sessionStorage.setItem('loginAuth', '0')
        //  console.log('sessionStorageexit==', sessionStorage.getItem('loginAuth'))
        this.$router.push('/login')
      },
      myWork () {
        this.$router.push('/home/myWork')
      },
      myTask () {
        this.myTaskNavColor = {
          color: 'rgb(255, 208, 75)',
          borderBottomColor: 'rgb(255, 208, 75)'
        }
        this.$router.push('/home/myTask')
      },
      allotTask () {
        this.$router.push('/home/AllotTask')
      },
      fileHandel () {
        this.$router.push('/home/filesHandle')
      }
    },

    mounted () {
      this.activeIndex = getActiveNav.getActiveHomeNav(window.location.href)
    },

    computed: {
      limitsOfauthority () {
        return this.$store.state.auth.limitsOfauthority
      },
      username () {
        return this.$store.state.auth.loginName
      }
      // myWorkNavColor() {
      //     return this.$store.state.MyworkNavColor.myworkNavColor
      // },
      // myTaskNavColor() {
      //     return this.$store.state.MyworkNavColor.myTaskNavColor
      // }
    },
    watch: {
      '$route.path': function (nv, ov) {
        // console.log('nv---', nv, '===', 'ov---', ov)
        // 从我的任务跳转到工作台
        if (nv === '/home/myWork' && ov === '/home/myTask') {
          this.setWorkColor = {
            color: '#FFD04B',
            borderBottomColor: '#FFD04B'
          }
          this.setTaskColor = {
            color: '#FFF',
            borderBottomColor: '#545c64'
          }
        }
        //从分配任务跳转到工作台 
        else if (nv === '/home/myWork' && ov === '/home/AllotTask') {
          this.setAllotTaskColor = {
            color: '#FFF',
            borderBottomColor: '#545c64'
          }
          this.setWorkColor = {
            color: '#FFD04B',
            borderBottomColor: '#FFD04B'
          }
        }
        else {
          this.setWorkColor = ''
          this.setTaskColor = ''
          this.setAllotTaskColor = ''
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .handleExit
    float: right;

  .el-icon-lightning, .el-icon-user
    color: #fff

  .loginInfo
    color: #ffffff
    borderBottomColor: #545C64
    backgroundColor: 'rgb(84, 92, 100)'
    cursor: default
    height:61px
    width: 130px
    float: right
    display :flex
    justify-content : space-evenly
    align-items :center
  .iconUser
    width: 30px
  .userText
    width: 100px
</style>
