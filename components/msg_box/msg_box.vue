<template>
	<view class="content">
		<view class="header" style="100%">
			<button type="button" class="btn btn-warning btn-sm" @click="clear()">清空</button>
			<text>连接状态：{{status}}</text>
			<text>{{broker}}</text>
		</view>
		
		<scroll-view scroll-y style="height: 500rpx;" class="msg_box">
			<view v-for="item in msgs" class="msg_item">
				<view class="topic">
					{{item.topic}}
				</view>
				<view class="msg">
					{{item.msg}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"msg_box",
		props:{
			status:{
				default:"未连接",
				type:[String]
			},
			msgs:{
				default:[
					{topic:"hello",msg:"hello mqtt!"}
				],
				type:[Array]
			},
			broker:{
				type:[String]
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			clear(){
				this.msgs.splice(0)
			}
		}
	}
</script>


<style lang="scss">
	.content{
		padding: 10rpx;
		border: 1px solid #a66678;
		border-radius: 10rpx;
		.header{
			display: block;
			background-color: $uni-bg-color;
		}
		.msg_box{
			background-color: rgba(200,190,130,0.4);
			border: 1px solid #afa178;
			padding: 5rpx;
			.msg_item{
				padding: 10rpx;
				border: 1px dotted #a66678;
				.topic{
					font-size: 30rpx;
					color: #afaf11;
				}
				.msg{
					font-size: 23rpx;
					color: #af8f11;
				}
			}
		}
	}
</style>
