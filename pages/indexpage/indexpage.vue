<template>
	<view class="">
		<view class="content">
			<bgImg></bgImg>
			<view class="title">
				<h1>智能艾灸监测系统</h1>
			</view>
			<view class="line"></view>
			<scroll-view scroll-y class="btns">
				<menuItem :icon="'../../static/icon/info.png'" @click.native="clicked('devices')">设备信息</menuItem>
				<menuItem :icon="'../../static/icon/temp.png'" @click.native="clicked('dashboard')">控温装置</menuItem>
				<menuItem :icon="'../../static/icon/smoke.png'" @click.native="clicked('dashboard')">控烟装置</menuItem>
				<menuItem :icon="'../../static/icon/temp.png'" @click.native="clicked('dashboard')">温度实时信息</menuItem>
				<menuItem :icon="'../../static/icon/smoke.png'" @click.native="clicked('dashboard')">烟雾实时信息</menuItem>
				<menuItem :icon="'../../static/icon/table.png'" @click.native="clicked('datadetial')">数据表格</menuItem>
				<menuItem :icon="'../../static/icon/chart.png'" @click.native="clicked('chart')">数据曲线</menuItem>
				<!-- <menuItem :icon="'../../static/icon/chart.png'" @click.native="clicked('index')">debug</menuItem> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	function navagateTo(url){
		uni.navigateTo({
			url:url
		})
	}
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast"
	import mqtt from 'mqtt/dist/mqtt.js'
	import {sign} from "../../static/js/JWTUtils.js"
	export default {
		mounted() {
			let username = "app_aicao_"+(Math.random()*1000000).toFixed(0)
			let clientid = username
			let pwd = sign({username:username,clientid,clientid})
			getApp().globalData.options.clientId=clientid
			getApp().globalData.options.username=username
			getApp().globalData.options.password=pwd
			this.connect()
		},
		data() {
			return {
				globalData:getApp().globalData,
				topic_sub:["post/aicao","post"]
			};
		},
		methods:{
			clicked(choice){
				navagateTo("/pages/"+choice+"/"+choice)	
			},
			log(d){
				if(typeof d == "object")
					uni.$emit("log",JSON.stringify(d))
				else
					uni.$emit("log",d)
			},
			connect(){
				try{
					
				this.log("connect starting")
				uni.showLoading({
					mask:true
				})
				this.globalData.connecting=true
				this.disconnect(this.globalData.client)
				this.globalData.client = mqtt.connect(this.globalData.broker,this.globalData.options)
				this.globalData.client.on("error",(err)=>{
					uni.hideLoading()
					this.globalData.connected=false
					this.globalData.connecting=false
					uni.showToast({
						title:"错误"+err,
						icon:"error",
						mask:true
					})
				})
				this.globalData.client.on("connect",
					(res)=>{
						uni.hideLoading()
						uni.showToast({
							title:"连接成功！",
							mask:true
						})
						this.globalData.connecting=false
						this.globalData.connected=true
						
						this.onConnected()
					},
					(err)=>{
						uni.hideLoading()
						this.globalData.connecting=false
					})
				this.globalData.client.on('message',
					(topic, message) =>{
					  // message is Buffer
					  try{
						  let msgjson=JSON.parse(message.toString())
						  // console.log(msgjson)
						  if(topic=='post/aicao/'+this.globalData.deviceid)this.setModelValue(msgjson)
					  }catch(err){
						  console.log(`not a json msg:${message}:${err}`)
					  }
					})
				this.log("connect end")
				}catch(err){
					this.log(err)
				}
			},
			setModelValue(msgjson){
				if(!msgjson)
					return
				else{
					this.log("收到模型信息..."+JSON.stringify(msgjson))
					uni.$emit("updateModel",msgjson)
				}
			},
			onConnected(){
				this.topic_sub.forEach((value,index)=>{
					this.globalData.client.subscribe(value,(err)=>{if(!err)uni.showToast({
						title:"订阅成功！"
					})})
				})
				this.globalData.client.on("close",()=>{
					this.globalData.connected=false
					toastSuccess("断开连接！")
				})
			},
			disconnect(client){
				uni.showLoading({
					title:"断开连接中...",
				})
				
				
				if(this.globalData.connected&&client){
					// #ifndef APP-PLUS
					client.end(true,(err)=>{
							if(!err){
								uni.hideLoading()
								toastSuccess("断开连接成功")
								this.globalData.connected=false
							}else{
								uni.hideLoading()
								toastError("断开连接失败！")
								this.globalData.connected=false
							}
						})
					// #endif
					// #ifdef APP-PLUS
					this.globalData.connected=false
					uni.hideLoading()
					toastSuccess("断开连接成功！")
					// #endif
					
				}else{
					uni.hideLoading()
					this.log("未连接，不能断开")
					toastError("未连接，不能断开！")
				}
			}
		},
		destroyed() {
			this.disconnect(getApp().globalData.client)
		},
		computed:{
			broker(){
				let broker = "wx://"+this.globalData.url+":8083/mqtt"
				// #ifdef H5
				broker="ws://"+this.globalData.url+":8083/mqtt"
				// #endif
				// #ifdef APP-PLUS
				broker="wx://"+this.globalData.url+":8083/mqtt"
				// #endif
				// #ifdef MP-WEIXIN
				broker="wxs://"+this.globalData.url+":8084/mqtt"
				// #endif
				return broker
			},
			status(){
				if(this.globalData.connecting) return "连接中"
				if(this.globalData.connected) return "已连接"
				return "未连接"
			}
		}
	}
</script>

<style lang="scss">
@font-face {
	font-family: "maobizi";
	src: url(../../static/font/DuanNingMaoBiXingShuWanZhengBan-2.ttf);
}
.content{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.title{
		margin-top: 200rpx;
		// font-family: maobizi;
		opacity: 0.85;
	}
	.line{
		width: 70%;
		border: 1px solid rgba(0,0,0,0.8);
	}
	.btns{
		margin-top: 60rpx;
		display: flexbox;
		flex-direction: row;
		flex-wrap: wrap;
		width: 80%;
		height: 700rpx;
		border: 2px solid rgba(0,0,0,0.6);
		border-radius: 30rpx;
		background-color: rgba(200, 200, 200, 0.3);
	}
}
</style>
