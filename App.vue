<script>
	import  {value_model,switch_model} from "model.js"
	let ip ="120.26.95.127"
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		mounted() {
			
		},
		globalData:{
			client:null,
			// url :"120.26.95.127",
			url:ip,
			port : "8083",
			// #ifdef H5
			broker:"ws://"+ip+":8083/mqtt",
			// #endif
			// #ifdef APP-PLUS
			broker:"wx://"+ip+":8083/mqtt",
			// #endif
			// #ifdef MP-WEIXIN
			broker:"wss://"+ip+":8084/mqtt",
			// #endif
			topic:"",
			options:{
				clientId:"aicao_app",
				clean:true,
				connectTimeout:30000,
				username:"test_55",
				password:"123456",
				keepalive:60	
			},
			value_model:value_model,
			switch_model:switch_model
		}
	}
</script>

<style lang="scss">
	
@import "@/uni_modules/uview-ui/index.scss";
/*每个页面公共css */
@import '@/uni_modules/uview-ui/theme.scss';

/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: "VFRegular";
  src: url("/static/font/mM3OHVqI7qmL.woff2") format("woff2"),
  url("/static/font/mM3OHVqI7qmL.woff") format("woff");
  // font-display: swap;
}
	
</style>
