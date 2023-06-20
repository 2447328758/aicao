<template>
	<view class="content">
		<bgImg></bgImg>
		<button class="btn-info btn-sm" @click="getTemp('temperature');getTemp('smoke')">手动刷新</button>
		<dataTable :data="tempData" :id="'temperature'" title="艾灸温度记录" identifier="温度" unit="℃"></dataTable>
		<dataTable :data="smokeData" :id="'smoke'" title="艾灸烟雾记录" identifier="烟雾浓度" unit="ppm"></dataTable>
	</view>
</template>

<script>
	import {InfluxQuery} from "../../static/js/influx_query.js"
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast"
	const opt_influx = getApp().globalData.opt_influxdb
	export default {
		data() {
			return {
				tempData:{
					categories:[],
					series:[]
				},
				smokeData:{
					categories:[],
					series:[]
				},
				influx_query:null,
				timer:null
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
						if(id == 'temperature')
							this.tempData=res
						else if (id == 'smoke')
							this.smokeData=res
					}
				},
				(err)=>
				{
					uni.$emit("log","query err!")
					uni.$emit("log","查询结束")
				})			
			}
		},
		onLoad(){
			const opt = opt_influx
			this.influx_query=new InfluxQuery(opt.url, opt.token, opt.org, opt.bucket)
		},
		onShow(){
			this.getTemp('temperature')
			this.getTemp('smoke')
			this.timer=setInterval(()=>{this.getTemp('temperature');this.getTemp('smoke')},30*1000)
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

</style>
