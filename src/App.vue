<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
import Login from './components/login.vue'

export default {
  name: 'App',
  components: {
    Login
  },
  created () {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  },
  mounted() {
      window.onpopstate = () => {
        // 这个allowBack 是存在vuex里面的变量
        // !this.allowBack

        if (!this.allowBack) {
          // console.log('this.allowBack===', this.allowBack)
            history.go(1)
        }
      }
  },
  computed: {
    allowBack: function () {
      return this.$store.state.route.allowBack
    }
  }
}
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
// 弹框高度
.el-popover.el-popper.disEmpoloy
  height: 400px
  overflow-y: auto
  overflow-x: hidden
// .el-dialog.createSampleBtn
//   z-index: 99999999999
  
</style>
