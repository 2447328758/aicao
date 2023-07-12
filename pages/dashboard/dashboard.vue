<template>
	<!-- 控制面板 -->
	<view class="content">
		<bgImg></bgImg>
		<!-- 预设温度 -->
		<infoCard>
			<template #title>预设温度</template>
			<template #content>
				<view class="cardContent">
					<view class="digitalNumber">
						<span class="value">{{targetTemp.targetValue.toFixed(1)}}</span><span class="unit">{{targetTemp.unit}}</span>
					</view>
					<view class="btnDown">
						<button @click="targetTemp.up()" type="button" class="btn btn-primary btn-sm">上升</button>
						<button @click="targetTemp.down()" type="button" class="btn btn-primary btn-sm">下降</button>
					</view>
				</view>
			</template>
		</infoCard>
		<!-- 当前温度 -->
		<infoCard progress :data="recData.temperature">
			<template #title>当前温度</template>
			<template #content>
				<view class="cardContent">
					<view class="digitalNumber">
						<span  class="value">{{recData.temperature.value.toFixed(1)}}</span><span  class="unit">{{recData.temperature.unit}}</span>
					</view>
				</view>
			</template>
		</infoCard>
		<!-- 烟雾浓度 -->
		<infoCard progress :data="recData.smoke" :bgcor="'bg-dark'">
			<template #title>烟雾浓度</template>
			<template #content>
				<view class="cardContent">
					<view class="digitalNumber">
						<span class="value">{{recData.smoke.value.toFixed(1)}}</span><span class="unit">{{recData.smoke.unit}}</span>
					</view>
				</view>
			</template>
		</infoCard>
		<!-- 点火状态 -->
		<!-- <infoCard status :data="statusData.fire">
			<template #title>点火状态</template>
		</infoCard> -->
		
		
		<!-- 转速 -->
		<!-- <infoCard>
			<template #title>控烟装置</template>
			<template #content>
				<view class="cardContent">
					<view class="digitalNumber">
						<span class="value">{{targetTemp.targetValue.toFixed(1)}}</span><span class="unit">{{targetTemp.unit}}</span>
					</view>
					<view class="btnDown">
						<button @click="targetTemp.up()" type="button" class="btn btn-primary btn-sm">上升</button>
						<button @click="targetTemp.down()" type="button" class="btn btn-primary btn-sm">下降</button>
					</view>
				</view>
			</template>
		</infoCard> -->
		<infoCard class="advice">
			<template #title>用户的年龄</template>
			<template #content>
				<view class="cardContent">
					<view class="digitalNumber">
						<view class="">
							<span class="value">{{age.value}}</span><span class="unit">{{age.unit}}</span>
						</view>
						<view class="advice-tips">
							<span class="badge badge-warning title">推荐的最适温度为<span class="value">{{getAdvice(age.value)[0]}}~{{getAdvice(age.value)[1]}}</span><span class="unit">°C</span></span>
						</view>
					</view>
					<view class="btnDown">
						<button @click="age.up()" type="button" class="btn btn-primary btn-sm">上升</button>
						<button @click="age.down()" type="button" class="btn btn-primary btn-sm">下降</button>
						<button @click="sendTempRange(getAdvice(age.value))" type="button" class="btn btn-danger btn-sm">设置</button>
					</view>
				</view>
			</template>
		</infoCard>
		<!-- <button @click="alertTemp()"> alert</button> -->
	</view>
</template>

<script>
	var topic_pub='set/aicao/'
	var sendTag=true
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast"
	function send(id,val,globalData){
		if(!globalData.connected){
			toastError("请先连接！")
			return
		}else{
			if(typeof val == 'object')
				val = JSON.stringify(val)
			globalData.client.publish(
				topic_pub+getApp().globalData.deviceid,
				`{"id":"${id}","value":${val}}`,
				(err)=>{
					if(!err)toastSuccess("设置成功!")
					else toastError("设置失败！"+err)
				}
			)
		}
	}
	export default {
		beforeMount() {
			this.recData.temperature.set(45)
			this.recData.smoke.set(40)
			this.registerUpdateModel()
		},
		data() {
			return {
				globalData:getApp().globalData,
				targetTemp:{
					targetValue:45.0,
					unit:"°C",
					up(){this.targetValue+=0.4},
					down(){this.targetValue-=0.4}
				},
				age:{
					value:50,
					unit:"岁",
					up(){this.value+=1},
					down(){this.value-=1}
				},
				userinfo:{
					deviceid:"",
					age:0
				},
				recData:getApp().globalData.recData,
				statusData:getApp().globalData.statusData
			};
		},
		methods:{
			log(d){
				if(typeof d == "object")
					uni.$emit("log",JSON.stringify(d))
				else
					uni.$emit("log",d)
			},
			registerUpdateModel(){
				uni.$on("updateModel",(msgjson)=>{
					this.log("updateModelEvent:"+JSON.stringify(msgjson))
					sendTag=false
					msgjson.value=Number(msgjson.value)
					if(this.recData[msgjson.id])
						this.recData[msgjson.id].set(msgjson.value)
					if(this.statusData[msgjson.id]&&(msgjson.value===1||msgjson.value===0))
						this.statusData[msgjson.id].set(msgjson.value)
					if(msgjson.id=="temperature")getApp().globalData.mqttRetainedValue.temperature=msgjson.value
					this.log("updateModelEvent done!:"+JSON.stringify(msgjson))
				})
			},
			getAdvice(age){
				// if(age<12) return 38.0
				// else if(age<16)return 40.0
				// else if(age<26)return 45.0
				// else if(age<30)return 48.0
				// else if(age<40)return 52.0
				// else if(age<45)return 48.0
				// else if(age<55)return 45.0
				// else return 44.8
				if(age>=20 && age <= 30)return[50,53]
				if(age>=30 && age <= 40)return[52,55]
				if(age>=40 && age <= 50)return[54,57]
				if(age>=50 && age <= 60)return[55,58]
				return [NaN,NaN]
			},
			sendTempRange(range){
				send("temperatureRange",{min:range[0],max:range[1]},this.globalData)
			},
		},
		onLoad(){
			this.userinfo.deviceid=getApp().globalData.deviceid
			this.userinfo.age=getApp().globalData.userage
			this.age.value=this.userinfo.age
		},
		watch:{
			'targetTemp.targetValue':function(val,oldVal){
				if(val>=this.recData.temperature.max){
					this.alertTemp()
					toastError("警告温度过高！")
					this.targetTemp.targetValue=this.recData.temperature.max
					return
				}else{
					send("temperature",val.toFixed(1),this.globalData)
				}
			}
		}
	}
</script>

<style lang="scss">
@font-face{font-family:electronicFont;src:url(../../static/font/DS-DIGII-3.ttf)}
.content{
	padding: 15rpx;
	display: flex;
	flex-wrap: wrap;
	.cardContent{
		.digitalNumber{
			font-family: electronicFont;
			.value{
				font-size: 45px;
			}
			.unit{
				font-size: 20px;
			}
			span{
				margin: 10rpx;
			}
		}
		.btnDown{
			button{
				margin: 5rpx;
			}
		}
	}
	.advice-tips{
		// border: 1px solid black;
		overflow: hidden;
		span{
			white-space: normal;
		}
		span .value,.unit{
			color: darkgreen;
		}
	}
	
}
</style>
