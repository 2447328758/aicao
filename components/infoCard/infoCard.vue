<template>
	<view class="content">
		<view class="card">
			<div><span class="badge badge-info title"><slot name="title"></slot></span></div>
			<slot name="content"></slot>
			<slot name="progress">
				<div class="progress" v-if="progress">
					<div :class="'progress-bar progress-bar-striped progress-bar-animated '+bgcor" 
						role="progressbar" 
						:style="'width:'+data.percent+'%'">
						<span>{{data.value.toFixed(1)}}{{data.unit}}</span>
					</div>
				</div>
			</slot>
			<slot name="status">
				<view class="cardContent" v-if="status">
					<view class="" style="margin: auto; text-align: center; font-size: 14px;">
						<span class="badge badge-dark">状态</span>
					</view>
					<view class="status digitalNumber">
						<span class="value" :class="{statusText:true, active:active, inactive:!active}" style="font-size: 20px; margin: auto;">{{getStatus(data)?"运行中":"未运行"}}</span>
					</view>
					<view class="btnDown">
						<button v-if="!getStatus(data)" @click="openStatus(data)" type="button" class="btn btn-warning btn-sm">打开</button>
						<button v-if="getStatus(data)" @click="closeStatus(data)" type="button" class="btn btn-warning btn-sm">关闭</button>
					</view>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"infoCard",
		props:{
			progress:{
				default:false,
				type:Boolean
			},
			status:{
				default:false,
				type:Boolean
			},
			data:{
				type:Object
			},
			bgcor:{
				default:"bg-danger",
				type:String
			}
			
		},
		data() {
			return {
				active:false
			};
		},
		methods:{
			getStatus(status){
				return status.value==1
			},
			closeStatus(status){
				status.value=0
				this.active=false
			},
			openStatus(status){
				status.value=1
				this.active=true
			}
		}
	}
</script>

<style lang="scss">
.content{
	display: inline block;
	width: 50%;
}
.card{
	flex: 1;
	.title{
		font-size: 25px;
		margin: 6rpx;
	}
		padding: 10rpx;
		display:inline-block;
		flex-direction: column;
		justify-content: center;
		border: 2px solid gray;
	.digitalNumber{
		font-family: electronicFont;
		// .value{
		// 	font-size: 43px;
		// }
		// .unit{
		// 	font-size: 20px;
		// }
		span{
			margin: 10rpx;
		}
	}
}

.status{
	display: flex;
	.statusText{
		padding: 5px;
		transition: ease-in-out;
		border-radius: 5px;
		transition-duration: 5000;
		font-size: 14px;
		// background-color: red;
	}
	.inactive{
		border-radius: 5px;
		background-color: red;
		color: darkblue;
	}
	.active{
		border-radius: 5px;
		background-color: green;
		color: white;
	}
}


	
</style>