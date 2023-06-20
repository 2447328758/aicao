<!-- 数据曲线 -->
<template>
	<view>
		<bgImg></bgImg>
		<view class="content">
			<button class="btn-info" @click="getServerData()">查询</button>
			<qiun-data-charts
			v-if="show_chart"
			type="line"
			:opts="opts"
			:chartData="chartData"
			/>
			<view v-if="show_nothing" class="tips">
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
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					dataLabel:false,
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [15,10,0,15],
					// enableScroll: true,
					legend: {},
					xAxis: {
					  disableGrid: true,
					  rotateLabel:true,
					  rotateAngle:60,
					  itemCount:15,
					  marginTop:10
					},
					yAxis: {
					  gridType: "dash",
					  dashLength: 2
					},
					extra: {
					  line: {
						type: "curve",
						width: 2,
						activeType: "hollow"
					  }
					}
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
