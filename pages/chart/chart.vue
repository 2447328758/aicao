<!-- 数据曲线 -->
<template>
	<view>
		<bgImg></bgImg>
		<view class="content">
			<button class="btn-info bg-font" @click="getServerData()">查询</button>
			<qiun-data-charts
			v-if="show_chart"
			type="line"
			:opts="opts"
			:chartData="chartData"
			/>
			<view v-if="show_nothing" class="tips bg-font">
				<text class="badge badge-warning" style="color: white;">没有数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	const opt_influx = getApp().globalData.opt_influxdb
	import {InfluxQuery} from "../../static/js/influx_query.js"
	import qiuyun from "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue"
	export default {
		components:{qiuyun},
		data() {
			return {
				chartData: {
							categories: ["A","B","C"],
							series: [{
								name:"xiaoming",
								data:[1,2,3]
							}],
						},
				
				influxQuery:null,
				show_chart:false,
				show_nothing:true,
				deviceid:""
			};
		},
		methods:{
			getServerData() {
				uni.$emit("log","正在查询数据库")
				let client_id=this.deviceid;
				console.log(client_id)
				let res=undefined
				this.influx_query.query(client_id,"-10m","30s")
				.then((res)=>{
					uni.$emit("log","收到influxdb："+JSON.stringify(res))
					this.chartData=res
					// console.log(res)
					if(res.categories.length==0){
						this.show_chart=false
						this.show_nothing=true
					}else{
						this.show_chart=true
						this.show_nothing=false
					}
				},
				(err)=>
				{
					uni.$emit("log","query err!")
					uni.$emit("log","查询结束")
				})				
			}
		},
		onLoad() {
			this.deviceid=getApp().globalData.deviceid
			console.log(this.deviceid)
			const opt = opt_influx
			this.influx_query=new InfluxQuery(opt.url, opt.token, opt.org, opt.bucket)
		},
		created() {
			this.getServerData()
		},
		mounted: async function () {
			let systeminfo = await uni.getSystemInfo()
			this.opts.height =  systeminfo.windowHeight-systeminfo.windowBottom
			this.opts.width =  systeminfo.windowWidth
		},
	}
</script>

<style lang="scss">
.content{
	padding: 10rpx;
}
.tips{
	display: flex;
	justify-content: center;
}
</style>
