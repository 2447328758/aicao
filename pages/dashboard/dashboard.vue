<!-- 控制面板 -->
<template>
	<view class="content">
		<view class="data_wrap">
			<view v-for="(item,index) in globalData.value_model" :key="index" class="data_box">
			<zai-lattice  class="data" shadow 
		    progressColor='#ffffff' 
		    :progressPercent='(item.value-item.min)*100/(item.max-item.min)'
		    :title='item.name' 
		    :num='item.value' 
		    :unit='item.unit'
			:type='item.type'
			:src='item.path'
			:size='30'
			@click="sendCmd(item.id,'value',item.name)"
			/>
			</view>
		</view>
		<view class="switch_wrap">
			<view class="switch_box" v-for="(item,index) in globalData.switch_model" :key="index">
				<text class="label">{{item.name}}</text>
				<switch :ref="item.id" class="switch" :checked="item.value===1" @change="switchChanged($event,item.id)"></switch>
			</view>
		</view>
	</view>
</template>

<script>
	import zaiLattice from "../../components/zai-lattice";
	function toastSuccess(title){
		uni.showToast({
			title:title
		})
	}
	function toastError(title){
		uni.showToast({
			title:title,
			icon:"error"
		})
	}
	export default {
		data() {
			return {
				globalData:getApp().globalData
			};
		},
		components:{
			zaiLattice,
		},
		methods:{
			sendCmd(id,type,value){
				if(!this.globalData.client){
					toastError("请先连接！")
					return true
				}
				let errcallback=(err)=>{
									if(err) uni.showToast({
										icon:"error",
										content:err
									})
									else
										uni.showToast({
											title:"操作成功！",
											duration:500
										})
								}
				if(type=='value'){
					uni.showModal({
						title:value,
						editable:true,
						placeholderText:"请输入值",
						success: (e) => {
							// console.log(e)
							if(e.confirm){
								getApp().globalData.client.publish('set',JSON.stringify({
									id:id,
									value:Number(e.content)
								}),{},
								errcallback)
							}else{
								uni.showToast({
									title:"用户取消"
								})
							}
						}
					})
				}else if( type=='switch'){
					getApp().globalData.client.publish('set',JSON.stringify({
						id:id,
						value:value
					}),{},
					errcallback)
				}
			},
			switchChanged(e,id){
				this.sendCmd(id,"switch", e.detail.value?1:0)
			}
		}
	}
</script>

<style lang="scss">
.content{
	padding: 15rpx;
	.data_wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.data_box{
			display: inline-block;
			margin: 20rpx;
			width: 300rpx;
		}
	}
	.switch_wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:start;
		.switch_box{
			.label{
				margin: 5rpx;
				font-size: 14rpx;
			}
			.switch{
				margin: 10rpx;
			}
		}
	}
}
</style>
