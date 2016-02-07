setInputParams = function(){
	//get input parameters and make "input_params"
	//getElementById , parseInt() is useful
	//input_params is got by getInputParams()

	input_params = {
		'environment':{
			'energy':{
				'energy_profile':function(time){
					var today_time = time % one_day;
					if(time % one_day < 6 * one_hour || time % one_day > 18 * one_hour ){
						return 0;
					}else{
						return 0.3*Math.sin(Math.PI*((today_time-6*one_hour)/(12*one_hour)));
					}
				},
				'cycle':24*60*60//[s]
			},
			'physic':[
				{'name':'moisture',
				'initial_value':700,
				'dif':-100/3600,
				'physic_profile':function(t){
						return 700 - 100 * t/(60*60);}}
			],
			'event':{
			}

		},
		'application':{
			'harvester':{
				'scale':4,//[W]
				'efficiency':0.8
			},
			'storage':{
				'capacity':30240,//[J]
				'initial_storage':0.2,//[%]
				'charge_efficiency':0.99,
				'leak_current':1.0 * Math.pow(10,-7)//[W]
			},
			'load':{
				'load_power_manager':{
					'efficiency':0.9
				},
				'mode_list':[
					{'mode':'active','current':50/*[mA]*/,'voltage':5/*[V]*/},
					{'mode':'sleep','current':10,'voltage':5},
					{'mode':'WiFi_standby','current':80,'voltage':5},
					{'mode':'WiFi_TX','current':120,'voltage':5}],
				'task_list':[
					{'name':'moisture_sensor','type':'sensor','current':35/*[mA]*/,'voltage':5,'execution_time':2000/*[ms]*/,
						'trigger':{'type':'timer','timer_type':'periodic','cycle':10/*[s]*/,'start':'application_start'}},
					{'name':'driving_motor','type':'actuator','current':220/*[mA]*/,'voltage':5,'execution_time':30000/*[ms]*/,'outputs':{'physical_quantity':'moisture','value':200},
						'trigger':{'type':'interface','info':{'driven_task':'moisture_sensor','type':'threshold_detection','physical_quantity':'moisture','value':500,'condition':'low'}}},
					{'name':'tweet','type':'data_transmission','mode':'WiFi_TX','current':0/*[mA]*/,'voltage':5,'execution_time':12000/*[ms]*/,
						'trigger':{'type':'follow_other_task','info':{'driven_task':'driving_motor'}}}]
			},
			'energy_adjustment':{
				'target_task_name':'tweet',
				'type':'execution',
				'condition':{'type':'battery_threshold_low','value':15/*%*/}
			}
		}
	};
	return input_params;
}