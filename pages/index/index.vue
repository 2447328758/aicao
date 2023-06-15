<template>
	<!-- 连接信息 -->
	<view class="content">
		<view class="up">
			<view class="form">
				<view class="form_item">
					<label class="">
						<text>url：</text>
						<uv-input class="uvinput"  placeholder="请输入ip地址" @change="onBrokerChanged()" v-model="globalData.url"></uv-input>
					</label>
				</view>
				<view class="form_item">
					<label class="">
						<text>port：</text>
						<uv-input class="uvinput"  placeholder="请输入端口号" @change="onBrokerChanged()" v-model="globalData.port"></uv-input>
					</label>
				</view>
				<button type="button" class="btn btn-primary btn-sm" @click="connect()">连接</button>
				<button type="button" class="btn btn-primary btn-sm" @click="disconnect(globalData.client)">断开连接</button>
				<button type="button" class="btn btn-primary btn-sm" @click="test()">测试</button>
			</view>
		</view>
		<msg_box :status="status" :msgs="msgs" :broker="broker"></msg_box>
		<logBox ref="logbox"></logBox>
	</view>
</template>

<script>
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast"
	import mqtt from 'mqtt/dist/mqtt.js'
	import dashboard from '../dashboard/dashboard.vue'
	export default {
		mounted() {
			this.connect()
		},
		components:{
			dashboard
		},
		data() {
			return {
				globalData:getApp().globalData,
				topic_sub:["post/aicao","post"],
				msgs:[]
			};
		},
		methods:{
			log(d){
				if(typeof d == "object")
					uni.$emit("log",JSON.stringify(d))
				else
					uni.$emit("log",d)
			},
			test(){
				this.log(mqtt)
			},
			onBrokerChanged(){
				getApp().globalData.broker=this.broker
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
				// this.log(this.globalData)
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
						  if(topic=='post/aicao')this.setModelValue(msgjson)
					  }catch(err){
						  console.log(`not a json msg:${message}:${err}`)
					  }
					  this.msgs.push({
						  topic:topic,
						  msg:message
					  })
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
		},
		watch:{
			msgs(val,oldval){
				if(val.length>20)
					this.msgs.shift()
					// console.log(this.msgs.length)
			}
		}
	}
</script>

<style lang="scss">
.content{
	padding: 10rpx;
	.up{	
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		label{
			display: block;
		}
		.form{
			border: 1px dashed darkblue;
			border-radius: 6rpx;
			background-color: rgba(60, 120, 200, 0.6);
			.form_item{
				padding: 5px;
				margin: 3px;
			}
			
			.uvinput{
				margin-bottom: 6px;
			}
			
		}
		.uvinput{
			display: inline-block;
			width: 500rpx;
		}
	}
	
}
</style>
