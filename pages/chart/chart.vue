<!-- 数据曲线 -->
<template>
	<view>
		<qiun-data-charts
		v-if="show_chart"
		type="line"
		:opts="opts"
		:chartData="chartData"
		/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
