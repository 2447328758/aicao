let value_model=[
	{
		id:"temperature",
		name:"温度",
		value:35,
		unit:"℃",
		max:100,
		min:20,
		type:"img",
		path:"@/static/icon/temperature.png",
	},
	{
		id:"smoke",
		name:"烟雾浓度",
		value:35,
		unit:"mod/l",
		max:100,
		min:20,
		path:"@/static/icon/smoke.png",
	}
]

let switch_model=[
	{
		id:"flash",
		name:"闪光灯开关",
		value:0
	},
	{
		id:"switch_smoke",
		name:"烟雾开关",
		value:1
	}
]

export {switch_model,value_model}