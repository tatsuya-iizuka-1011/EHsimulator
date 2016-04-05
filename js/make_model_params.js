var harvester_scale = 2.5;//[W]
var solar_radiation = 0.6;//[W]
//var input_solar = [0,0,0,0,0,0,0.03,0.45,0.94,1.60,1.75,1.78,1.37,1.38,1.64,1.26,0.84,0.53,0.16,0,0,0,0,0]; //24:00~23:00
var input_solar = [0,0,0,0,0,0,0.03,0.44,0.95,1.81,2.07,2.04,2.38,1.99,1.14,0.84,0.25,0.05,0,0,0,0,0,0];
var i = 0;
for(i=0;i<input_solar.length;i++){
	input_solar[i] = input_solar[i]/3.6;
}
setInputParams = function(){
	//get input parameters and make "input_params"
	//getElementById , parseInt() is useful
	//input_params is got by getInputParams()

	input_params = {
		'environment':{
			'energy':{
				'energy_profile':function(time){


					/*
					var sun_hour =  Math.round(time/3600);
					return input_solar[sun_hour]+(input_solar[sun_hour+1]-input_solar[sun_hour])*(time/3600-(sun_hour-0.5));*/



					var today_time = time % one_day;
					if(time % one_day < 6 * one_hour || time % one_day > 18 * one_hour ){
						return 0;
					}else{
						return solar_radiation*Math.sin(Math.PI*((today_time-6*one_hour)/(12*one_hour)));
					}
				},
				'cycle':24*60*60//[s]
			},
			'physic':[
				{'name':'moisture',
				'initial_value':700,
				'dif':-50/3600,
				'physic_profile':function(t){
						return 620 - 100 * t/(60*60);}}
			],
			'event':{
			}

		},
		'application':{
			'harvester':{
				'scale':harvester_scale,//[W]
				'efficiency':0.8
			},
			'storage':{
				'capacity':28800,//[J]
				'initial_storage':0.2,
				'charge_efficiency':0.99,
				'leak_current':1.0 * Math.pow(10,-7)//[W]
			},
			'load':{
				'load_power_manager':{
					'efficiency':0.9
				},
				'mode_list':[
					{'mode':'active','current':50/*[mA]*/,'voltage':7/*[V]*/},
					{'mode':'sleep','current':10,'voltage':7},
					{'mode':'WiFi_standby','current':80,'voltage':7},
					{'mode':'WiFi_TX','current':120,'voltage':7}],
				'task_list':[
					{'name':'moisture_sensor','type':'sensor','current':35/*[mA]*/,'voltage':5,'execution_time':2000/*[ms]*/,
						'trigger':{'type':'timer','timer_type':'periodic','cycle':10/*[s]*/,'start':'application_start'}},
					{'name':'driving_motor','type':'actuator','current':220/*[mA]*/,'voltage':5,'execution_time':30000/*[ms]*/,'outputs':{'physical_quantity':'moisture','value':200},
						'trigger':{'type':'interface','info':{'driven_task':'moisture_sensor','type':'threshold_detection','physical_quantity':'moisture','value':500,'condition':'low'}}},
					{'name':'tweet','type':'data_transmission','mode':'WiFi_TX','current':0,'voltage':7,'execution_time':12000,
						'trigger':{'type':'follow_other_task','info':{'driven_task':'driving_motor'}}}]
			},
			'energy_adjustment':{
				'target_task_name':'tweet',
				'type':'execution',
				'condition':{'type':'battery_threshold_low','value':15/*%*/}
			}
		},'info':{
			'start_time':8
		}
	};
	return input_params;
}
var p_zoom_range = {min:[11,59,0],max:[12,1,0]};
