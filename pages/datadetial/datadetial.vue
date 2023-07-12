<template>
	<view class="content">
		<bgImg></bgImg>
		<!-- <button class="btn-info btn-lg" @click="getTemp('temperature');getTemp('smoke')">手动刷新</button> -->
		<view v-if="currentId=='temperature'" class="tempSatus card keji">
			<view class="card-header">
				<view class="card-columns">
					<text class="bg-font">	当前温度：{{globalData.mqttRetainedValue.temperature.toFixed(1)}}°C</text>
				</view>
				<!-- <view class="card-columns">
					<text class="bg-font">	推荐最适温度：{{getAdvice(userage)[0]}}~{{getAdvice(userage)[1]}}°C</text>
				</view> -->
				<!-- <view class="card-text">
					<span>当前结果仅供参考</span>
				</view> -->
			</view>
			
		</view>
		<button class="btn-info btn-lg" @click="tableConfig[currentId].data = getTemp(currentId)">手动刷新</button>
		<!-- <dataTable :data="tempData" :id="'temperature'" title="艾灸温度记录" identifier="温度" unit="℃"></dataTable>
		<dataTable :data="smokeData" :id="'smoke'" title="艾灸烟雾记录" identifier="烟雾浓度" unit="ppm"></dataTable> -->
		<dataPage 
			:data="tableConfig[currentId].data" 
			:id="tableConfig[currentId].id" 
			:title="tableConfig[currentId].title" 
			:identifier="tableConfig[currentId].identifier" 
			:unit="tableConfig[currentId].unit" 
			:show_chart="chartConfig.show_chart"
			:show_nothing="chartConfig.show_nothing"
			:chartData="chartConfig.chartData"
			@onQueryChartData="getServerData()">
			</dataPage>
		
	</view>
</template>

<script>
	import {InfluxQuery} from "../../static/js/influx_query.js"
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast"
	const opt_influx = getApp().globalData.opt_influxdb
	export default {
		data() {
			return {
				// tempData:{
				// 	categories:[],
				// 	series:[]
				// },
				// smokeData:{
				// 	categories:[],
				// 	series:[]
				// },
				globalData:getApp().globalData,
				influx_query:null,
				timer:null,
				currentId:"temperature",
				chartConfig:{
					show_chart:false,
					show_nothing:true,
					chartData:{
						categories: ["A","B","C"],
						series: [{
							name:"xiaoming",
							data:[1,2,3]
						}],
					}
				},
				tableConfig:{
					"temperature":{
						data:{
							categories:[],
							series:[]
						},
						id:"temperature",
						title:"艾灸温度记录",
						identifier:"时间" ,
						unit:"℃" 
					},
					"smoke":{
						data:{
							categories:[],
							series:[]
						},
						id:"smoke",
						title:"烟雾浓度记录",
						identifier:"时间" ,
						unit:"ppm" 
					}
				},
				userage:0
			}
		},
		methods: {
			getTemp(id){
				// toastLoading("正在查询...")
				uni.$emit("log","正在查询数据库")
				let client_id=getApp().globalData.deviceid
				// let res=undefined
				// let id = "temperature"
				this.influx_query.query(client_id,"-10m","30s",id)
				.then((res)=>{
					uni.$emit("log","收到influxdb："+JSON.stringify(res))
					// console.log(res)
					if(res.categories.length==0){
						uni.showToast({
							title:"没有数据！"
						})
					}else{
						// if(id == 'temperature')
						// 	this.tempData=res
						// else if (id == 'smoke')
						// 	this.smokeData=res
						this.tableConfig[this.currentId].data = res
					}
				},
				(err)=>
				{
					uni.$emit("log","query err!")
					uni.$emit("log","查询结束")
				})		
			}
			,
			getServerData() {
				uni.$emit("log","正在查询数据库")
				let client_id=getApp().globalData.deviceid;
				console.log("查询的clientid",client_id)
				let res=undefined
				toastLoading("正在查询！")
				// this.influx_query.query(client_id,"-10m","30s")
				this.influx_query.query(client_id,"-10m","30s",this.currentId)
				.then((res)=>{
					uni.$emit("log","收到influxdb："+JSON.stringify(res))
					// res.series = res.series.find(ele=>ele.name==this.currentId)
					// res.series[0].name=this.tableConfig[this.currentId].identifier
					// console.log(res.series.length)
					this.chartConfig.chartData=res
					// console.log(res)
					if(res.categories.length==0){
						this.chartConfig.show_chart=false
						this.chartConfig.show_nothing=true
						toastError("没有数据！")
					}else{
						this.chartConfig.show_chart=true
						this.chartConfig.show_nothing=false
						toastSuccess("查询成功！")
					}
				},
				(err)=>
				{
					uni.$emit("log","query err!")
					uni.$emit("log","查询结束")
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
		},
		onLoad(e){
			// console.log(e)
			this.currentId=e.id
			const opt = opt_influx
			this.influx_query=new InfluxQuery(opt.url, opt.token, opt.org, opt.bucket)
			this.userage=getApp().globalData.userage
		},
		onShow(){
			this.timer=setInterval(
			()=>{
				this.getTemp(this.currentId);
				this.getServerData()
			}
			,
			30*1000)
		},
		onHide(){
			clearInterval(this.timer)
			this.timer=null
		}
	}
</script>

<style lang="scss">
.content{
	padding: 50rpx;
	box-sizing: border-box;
}

.tempSatus{
	margin:1rpx;
	.text{
		font-size: 35px;
	}
}

</style>
