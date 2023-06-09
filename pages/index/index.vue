<!-- 连接信息 -->
<template>
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
				<button @click="connect()">连接</button>
				<button @click="disconnect(globalData.client)">断开连接</button>
				<button @click="test()">测试</button>
			</view>
		</view>
		<msg_box :status="status" :msgs="msgs" :broker="broker"></msg_box>
		<logBox ref="logbox"></logBox>
	</view>
</template>

<script>
	import mqtt from 'mqtt/dist/mqtt.js'
	export default {
		data() {
			return {
				globalData:getApp().globalData,
				connected:false,
				connecting:false,
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
				this.connecting=true
				this.disconnect(this.globalData.client)
				this.globalData.client = mqtt.connect(this.globalData.broker,this.globalData.options)
				// this.log(this.globalData)
				this.globalData.client.on("error",(err)=>{
					uni.hideLoading()
					this.connected=false
					this.connecting=false
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
						this.connecting=false
						this.connected=true
						
						this.onConnected()
					},
					(err)=>{
						uni.hideLoading()
						this.connecting=false
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
				for(let i =0;i<getApp().globalData.value_model.length;i++){
					if(getApp().globalData.value_model[i].id==msgjson.id){
						getApp().globalData.value_model[i].value=msgjson.value
					}
				}
				
				for(let i =0;i<getApp().globalData.switch_model.length;i++){
					if(getApp().globalData.switch_model[i].id==msgjson.id){
						getApp().globalData.switch_model[i].value=msgjson.value
					}
				}
				
			},
			onConnected(){
				this.topic_sub.forEach((value,index)=>{
					this.globalData.client.subscribe(value,(err)=>{if(!err)uni.showToast({
						title:"订阅成功！"
					})})
				})
			},
			disconnect(client){
				uni.showLoading({
					title:"断开连接中...",
				})
				if(this.connected&&client){
					client.end(true,{},(err)=>{
						if(!err){
							uni.hideLoading()
							uni.showToast({
								title:"断开连接成功！"
							})
							this.globalData.connected=false
						}else{
							uni.hideLoading()
							uni.showToast({
								title:"断开失败！",
								icon:'error'
							})
						}
					})
				}else{
					uni.hideLoading()
					this.log("未连接，不能断开")
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
				if(this.connecting) return "连接中"
 				if(this.connected) return "已连接"
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
