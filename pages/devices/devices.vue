<template>
	<view class="out">
		<bgImg></bgImg>
		<div class="form-group">
			<div class="input-group">
			  <div class="input-group-prepend">
			    <span class="input-group-text bg-font" >{{"&nbsp;设&nbsp;备&nbsp;i&nbsp;d&nbsp;"}}</span>
			  </div>
			  <textarea class="form-control bg-font" aria-label="With textarea" v-model="addid"></textarea>
			</div>
			
			<div class="input-group">
			  <div class="input-group-prepend">
			    <span class="input-group-text bg-font">{{"&nbsp;"}}用户年龄</span>
			  </div>
			  <textarea class="form-control bg-font" aria-label="With textarea" v-model="addage"></textarea>
			</div>
			<!-- <small id="deviceidHelp" class="form-text text-muted">为了更好地提供服务</small> -->
			<small id="deviceidHelp" class="form-text text-muted sm-font">艾灸盒背面标签上写有设备id</small>
			<button @click="add" class="btn btn-outline-primary addbtn bg-font">添加</button>
		</div>
		<table class="table table-striped table-bordered devices">
			<thead>
				<tr>
					<th scope="col" width="30%">设备id</th>
					<th scope="col" width="30%">用户年龄</th>
					<th scope="col" width="40%">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="u,i in users" :class="{choosed:u.did==did}" :key="u.did">
					<td class="mid-font">{{u.did}}</td>
					<td class="mid-font">{{u.age}}</td>
					<td class="mid-font">
						<button @click="choose(i)" class="btn btn_oper btn-outline-primary btn-sm" style="width: 46px;">设置</button>
						<button @click="del(i)" class="btn btn_oper btn-outline-danger btn-sm" style="width: 46px;">删除</button>
					</td>
				</tr>
			</tbody>
		</table>
	</view>
</template>

<script>
	var deviceKey = "devices"
	async function getDevices(){
		return await uni.getStorage({
			key:deviceKey
		})
	}
	
	function saveDevices(users){
		uni.setStorage({
			key:deviceKey,
			data:users
		})
	}
	export default {
		data() {
			return {
				addid:"",
				addage:"",
				users:[
					{"did":"aicao1","age":15}
				],
				did:""
			};
		},
		methods:{
			add(){
				if(String(Number(this.addage)) === "NaN"){
					uni.showToast({
						title:"请输入正确的年龄！",
						icon:"error"
					})
					return;
				}else if(this.users.filter((e,index)=>e.did==this.addid).length!=0){
					uni.showToast({
						title:"不允许重复添加！",
						icon:"error"
					})
					return;
				}
					
				this.users.push({"did":this.addid,"age":Number(this.addage)})
				saveDevices(this.users)
			},
			choose(index){
				let oldid = getApp().globalData.deviceid
				getApp().globalData.client.unsubscribe("post/aicao/"+oldid)
				getApp().globalData.deviceid=this.users[index].did
				getApp().globalData.userage=this.users[index].age
				getApp().globalData.client.subscribe("post/aicao/"+this.users[index].did)
				uni.showToast({
					title:"设置成功！"
				})			
			},
			del(index){
				getApp().globalData.client.unsubscribe("post/aicao/"+this.users[index].did)
				this.users.splice(index,1)
				saveDevices(this.users)
			}
		},
		onLoad(){
			this.did=getApp().globalData.deviceid
			getDevices().then(res=>{
				if(typeof res.data === 'object')
					this.users=res.data
				else
					this.users=[]
				// console.log(this.users)
			})
			
		}
	}
</script>

<style lang="scss">
.out{
	padding: 6px;
	.addbtn{
		margin-left: 70%;
	}
	.devices{
		text-align: center;
	}
	.choosed{
		background-color: rgba(40,40,255,0.6);
	}
	.btn_oper{
		margin: 0 5px;
	}
}
</style>
