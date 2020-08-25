<template>
	<div class="usercompletion singin_then">
		<div class="then_content">
			<h3 class="title">请完善以下流程</h3>
			<div class="select_menu">
				<div class="menu_list" data-index="0" :class="singinThenStatus === 0 ? 'active': ''">基本信息</div>
				<!-- <div class="menu_list" data-index="1" :class="singinThenStatus === 1 ? 'active': ''">个人描述</div> -->
				<div class="menu_list" data-index="1" :class="singinThenStatus === 1 ? 'active': ''">完成注册</div>
			</div>
			<div class="select_content">
				<div class="content_list" v-show="singinThenStatus === 0">
					<div class="block_area">
						<!-- <label for="nickname">姓名：</label> -->
						<input type="text" id="nicknameinput" v-model="nickname" placeholder="请输入姓名(必填)">
					</div>
					<div class="block_area">
						<input type="text" id="workIDinput" v-model="workID" placeholder="请输入工号">
					</div>
					<div class="block_area">
						<input type="text" id="phoneNuminput" v-model="phoneNum" placeholder="请输入联系方式">
					</div>
					<!-- <div class="block_area">
						<label>你是GG还是MM？</label>
						<div class="div_check">
							<input class="custom_input" type="radio" value="0" v-model="usersex" name="usersex" id="boy"> <label class="inline custom_input" for="boy">男</label>
						</div> 
						<div class="div_check">
							<input class="custom_input" type="radio" value="1" v-model="usersex" name="usersex" id="girl"> <label class="inline custom_input" for="girl">女</label> 
						</div> 
					</div> -->
				</div>
				<!-- <div class="content_list" v-show="singinThenStatus === 1">
					<textarea id="userdesc" v-model="userdesc" placeholder="给自己一个简单的描述吧" rows="5"></textarea>
				</div> -->
				<div class="content_list" v-show="singinThenStatus === 1">
					<div class="tips">
						<i class="icon-smile"></i>
						<p class="desc">注册成功，去登陆吧</p>
					</div>
				</div>
				<input type="button" class="goLogin" ref="nextBtn" :value="singinThenStatus === 1 ? '去登陆':'下一步'" @click="nextSub">
			</div>
		</div>
	</div>
</template>
<script>
	// import fecth from 'utils/fecth.js'
	// import API from 'config/api'
	export default {
		data () {
			return {
				// 0 是第一步。1 是第二步。2 是第三步
				singinThenStatus: 0,
				nickname: '',
				workID: '',
				phoneNum:'',
				// usersex: '',
				userdesc: ''
			}
		},
		props: {
			// 显示的正确内容
			username: {
				type: String,
				default: ''
			}
		},
		methods: {
			nextSub () {
				if (this.singinThenStatus === 0) {
					this.updateUserSigninInfo()
					return
				}
				// if (this.singinThenStatus === 1) {
				// 	this.updateUserDesc()
				// 	return
				// }
				if (this.singinThenStatus === 1) {
					this.showSinginThen = false
					this.$emit('hidesingin')
					this.status = 0
					return
				}
			},
			updateUserSigninInfo () {
				let reslutNickName = this.nickname.replace(/(^\s*)|(\s*$)/g, '')
				if (reslutNickName === '' || reslutNickName.includes(' ')) {
					this.$msg({text: '姓名不能为空', background: 'red'})
					return
				}
				// if (this.usersex === '') return
				this.$axios({
					method:'post',
					url:'/user/edit',
					data: {
						username: this.username,
						nickname: this.nickname,
						// password: this.password,
						phoneNum: this.phoneNum,
						workID:this.workID
					}
				})
				.then((res) =>{
					this.$msg(res.data.msg)
					if (res.data.code === 0) {
						console.log('res===', res)
						this.singinThen()
					}
				})
				.catch((err) =>{
					console.log('err==',err)
				})
				this.singinThenStatus = this.singinThenStatus + 1
			},
			updateUserDesc () {
				if (this.userdesc.length < 10) {
					this.$msg({text: '描述不能少于10个字', background: 'red'})
				} else {
					// fecth.post(API.UPDATE_SINGIN_INFO, {
					// 	username: this.username,
					// 	nickname: this.nickname,
					// 	usersex: this.usersex,
					// 	userdesc: this.userdesc
					// }).then((res) => {
					// 	console.log(res.data)
					// 	if (res.data.code === '1') {
					// 		this.$msg({text: '恭喜，已激活注册的账号，可直接登录', background: '#00d032'})
					// 		this.singinThenStatus ++
					// 	}
					// }, (err) => {
					// 	alert(`数据请求错误: ${JSON.stringify(err)}`)
					// })
				}
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/global.styl'
@import '../../common/stylus/custom_input.styl'
	.singin_then
		position:absolute
		top: 50%
		left:50%
		width: 90%
		min-height: 350px
		max-width: 340px
		padding: 5px 0px
		transform: translate3d(-50%,-50%,0)
		z-index: 3
		background: rgba(0,0,0,0.4)
		color: #fff
		.title
			text-align:center
			font-size: 16px
			margin:0 auto;
			padding: 5px 0;
		.select_menu
			text-align: center;
			width: 100%
			height: 48px
			line-height: 48px
			font-size: 0
			padding: 0 5px
			box-sizing: border-box
			.menu_list
				display:inline-block
				font-size: 16px
				color: #fff
				width: 33.33333%
				text-align:center
				vertical-align:middle
				position:relative
				cursor: pointer
				font-size: 14px
				&.active
					&:before
						content: ''
						width: 30%
						height: 2px 
						background: $border_color
						position: absolute
						bottom: 0
						left: 50%
						transform: translate3d(-50%,0,0)
		.select_content
			position:relative
			box-sizing: border-box
			padding: 0 20px
			.content_list
				.block_area
					margin: 10px 0 20px 0
					.div_check
						display:inline-block
				.label-userName
					margin-bottom:10px;
					
				input[type='button']
					margin-top:0
					-webkit-appearance:none
				textarea
					width: 100%
					color: #fff
					background:transparent
					border: 1px solid $text_active
					outline:none 0
					resize: none
					padding: 4px
					box-sizing:border-box
					-webkit-appearance:none
					margin-top: 20px
				.tips
					display:flex
					align-items:center
					justify-content:center
					padding: 30px 0 10px 0
					font-size:14px
					i
						margin-right: 10px
						font-size: 20px
	#nicknameinput,#workIDinput,#workIDinput,#phoneNuminput
		background: transparent;
		outline: none;
		height: 36px;
		width: 100%;
		color: #fff;
		text-indent: 4px;
		font-size: 14px;
		border: none;
		border-bottom: 1px solid #aaa;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		display: block;
	.goLogin
		background: rgba(255,12,12,0.03);
		border: 1px solid rgba(255,12,12,0.03);
		height: 32px;
		width: 100%;
		border-radius: 2px;
		color: #fff;
		height: 36px;
		line-height: 36px;
		margin-top: 30px;
		margin-bottom: 10px;
		outline: none;
		cursor: pointer;
		-webkit-appearance: none;	
</style>
