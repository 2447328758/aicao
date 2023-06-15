<template>
	<view>
		<view class="title box">
			<span class="badge badge-info" >{{title}}</span>
		</view>
		<scroll-view class="scroll table" scroll-y :style="{height:height}">
			<table class="table table-striped table-bordered">
				<thead>
					<tr>
						<th scope="col" width="50%">{{identifier}}</th>
						<th scope="col" width="50%">值（{{unit}}）</th>	
					</tr>
				</thead>
				<tbody>
					<tr v-for="i in data.categories.length" :key="i">
						<th scope="row">{{data.categories[data.categories.length-i]}}</th>
						<td>{{data.series.find(ele=>ele.name==id).data[data.categories.length-i]}}</td>
					</tr>
				</tbody>
			</table>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"dataTable",
		props:{
			identifier:{
				default:"温度",
				type:String
			},
			unit:{
				default:"单位",
				type:String
			},
			title:{
				default:"",
				type:String
			},
			data:{
				default:{
					categories: new Array(100).fill(new Date(Date.now()).toTimeString().substring(0,8)),
					series: new Array(100).fill(12.6)
				},
				type:[Object]
			},
			height:{
				default:"600rpx",
				type:String
			},
			id:{
				type:String
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
@import url('./bootstrap.min.css');
.title.box{
	text-align: center;
	margin: 5rpx;
}
.table{
	text-align: center;
	font-size: 10px;
	tr{
		height: 10px;
	}
}

.scroll.table{
	// height: 600rpx;
	padding: 5rpx;
	border: 1px solid rgba(123,123,123,0.8);
	border-radius: 3rpx;
}
</style>