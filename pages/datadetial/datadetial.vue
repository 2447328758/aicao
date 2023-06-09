<template>
	<view class="content">
		<dataTable :data="tempData" title="艾灸温度记录" identifier="温度" unit="℃"></dataTable>
		<dataTable :data="smokeData" title="艾灸烟雾记录" identifier="烟雾浓度" unit="ppm"></dataTable>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempData:{},
				smokeData:{}
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

.content{
	padding: 50rpx;
	box-sizing: border-box;
}

</style>
