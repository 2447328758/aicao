<script>
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
			deviceid:"aicao2",
			userage:30,
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
			connected:false,
			connecting:false,
			opt_influxdb:{
				url:`http://${ip}:8086`,
				org:"cgqgzs",
				bucket:"aicao",
				_measurement:"data",
				_field:"value",
				token:"ft0aJ0ZdfU89CDKnUVFRDWGraR1WQo6k2dBpQNF2It_0inwgZSi7-9gHTB9P7EAslcief9YQIpRqbaD38mCOdw=="
			},
			mqttRetainedValue:{
				temperature:0,
				temperatureAdvice:0
			}
		}
	}
</script>

<style lang="scss">

@import url('./static/bootstrap-4.6.2-dist/css/bootstrap.css');
@font-face{font-family:electronicFont;src:url(./static/font/DS-DIGII-3.ttf)}
/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: "VFRegular";
  src: url("/static/font/mM3OHVqI7qmL.woff2") format("woff2"),
  url("/static/font/mM3OHVqI7qmL.woff") format("woff");
  // font-display: swap;
}

.bg-font{
	font-size: 60rpx;
}

.mid-font{
	font-size: 45rpx;
}

.sm-font{
	font-size: 30rpx;
}

.keji{
	font-family: electronicFont;
}
</style>
