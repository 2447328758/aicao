<template>
	<view>
		<view class="log">
			<button type="button" class="btn btn-warning btn-sm" @click="log=''">清空</button>
			<textarea disabled cols="30" rows="10" placeholder="日志" style="width: 100%;" :value="log"></textarea>
		</view>
	</view>
</template>

<script>
	export default {
		name:"logBox",
		data() {
			return {
				log:""
			};
		},
		methods:{
			registerLogger() {
				uni.$on("log",(log)=>{this.log+=log+"\n"})
			}
		},
		beforeMount() {
			this.registerLogger()
		}
		
	}
</script>

<style lang="scss">
.log{
	margin: 5px;
	padding: 3px;
	border: 3px solid rgba(120,130,190,0.9);
	border-radius: 3px;
	background-color: rgba(120,130,190,0.6);
}
</style>