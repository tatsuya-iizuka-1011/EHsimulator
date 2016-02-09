var input_params = new Array();
var sys_params;
var now_time=0;
var one_hour = 60*60;
var one_day = one_hour * 24;
var start_time;

function Model(){
	this.name = "model";
	this.mode;
	this.sys_params;
	var obj = setInputParams();
	this.setSysParams(obj);
	this.setPhysicalQuantity();
	this.setTaskList();
	this.setInterfaceList();
}

Model.prototype.setSysParams = function(args){
	this.sys_params = $.extend(true, {}, args);
	start_time = args.info.start_time * one_hour;
}

Model.prototype.setTaskList = function(){
	var task_list = [];
	var task_list_from_sys = this.sys_params.application.load.task_list;
	for(var i=0;i<task_list_from_sys.length;i++){
		var task = new Task;
		//task = $.extend(true, {}, this.sys_params.application.load.tasks[i]);
		var task_from_sys = task_list_from_sys[i];
		for(key in task_from_sys){
			task[key] = task_from_sys[key];
		}
		task.now_mode = false;
		task.parent_model = this;
		task_list.push(task);
	}
	this.task_list = task_list;
	
	//set Follow Other Task
	for(var i=0;i<task_list.length;i++){
		if(task_list[i].trigger.type == 'follow_other_task'){
			for(var j=0;j<task_list.length;j++){
				if(task_list[j].name == task_list[i].trigger.info.driven_task){
					task_list[j].trigger_task = task_list[i];
					task_list[i].driven_task = task_list[j];
				}
			}
		}
	}
}

Model.prototype.setInterfaceList = function(){
	this.interface_list = [];
	var task_list = this.task_list;
	for(var i=0;i<task_list.length;i++){
		var task = task_list[i];
		if(task.trigger.type == 'interface'){
			var interface = task.trigger.info;
			interface.trigger_task = task;//ok
			task.driven_interface = interface;
			for(var j=0;j<task_list.length;j++){
				if(task.trigger.info.driven_task == task_list[j].name){
					interface.driven_task = task_list[j];
					task_list[j].trigger_interface = interface;
					task_list[j].trigger_task = task_list[j];
					task_list[i].driven_task = task_list[j];
				}
			}
			this.interface_list.push(interface);
		}
	}
}

Model.prototype.setNextTime = function(time){
	var task_list = this.task_list;
	var next_t = 0;
	this.checkInterfaceTrigger();
	//check follow Other task
	this.checkFollowTrigger();

	for(var i=0;i<task_list.length;i++){
		var task = task_list[i];
		task.setNextTimer(now_time);
		if(task.next_time> 0){
			if(!next_t){
				next_t = task.next_time;
			}else{
				next_t = (next_t <= task.next_time ? next_t:task.next_time)
			}
		}
	}
	return next_t;
}

Model.prototype.checkInterfaceTrigger = function(){
	for(var i=0;i<this.interface_list.length;i++){
		var interface = this.interface_list[i];
		if(interface.driven_task.now_mode == true){
			if(interface.type == 'threshold_detection'){
				var physical_value = this.getPhysicalQuantity({'physical_quantity':interface.physical_quantity,'time':now_time});
				if((interface.condition == 'low' && interface.value > physical_value )  ||(interface.condition == 'high' && interface.value < physical_value)){
					interface.trigger_task.now_mode = true;
					for(var j=0;j<this.physic_list.length;j++){
						if(this.physic_list[i].name == interface.physical_quantity)
							this.physic_list[i].now_value += interface.trigger_task.outputs.value;
					}
				}
			}else if(interface.type == 'event_detection'){
			}
		}
	}
}
Model.prototype.checkFollowTrigger = function(){
	for(var i=0;i<this.task_list.length;i++){
		var task = this.task_list[i];
		if(task.now_mode && task.trigger_task && task.next_time == now_time)
			task.trigger_task.now_mode  = 1;
	}

}
//to be written
Model.prototype.setPhysicalQuantity = function(args){
	this.physic_list = [];
	for(var i=0;i<this.sys_params.environment.physic.length;i++){
		var physic = this.sys_params.environment.physic[i];
		physic.prev_time = start_time;
		physic.now_value = physic.initial_value;
		this.physic_list.push(physic);
	}
}
Model.prototype.getPhysicalQuantity = function(args){
	for(var i=0;i<this.physic_list.length;i++){
		if(args.physical_quantity == this.physic_list[i].name){
			var physic = this.physic_list[i];
			physic.now_value = physic.now_value + physic.dif*(args.time-physic.prev_time);
			physic.prev_time = args.time;
			return  physic.now_value
		}
	}
}
Model.prototype.getHarvestedPower = function(time){
	//return 0;
	return this.sys_params.environment.energy.energy_profile(time)*this.sys_params.application.harvester.scale*this.sys_params.application.harvester.efficiency;
}
Model.prototype.getStandbyPower = function(){
	var now_mode = this.mode;
	var mode_list = this.sys_params.application.load.mode_list;
	for(var i = 0;i<mode_list.length;i++){
		if(now_mode == mode_list[i].mode){
			return mode_list[i].current /1000 * mode_list[i].voltage;
		}
	}
	alert('mode is not defined');
}

Model.prototype.getTasksPower = function(){
	var Ptasks = 0;
	for(var i=0;i<this.task_list.length;i++){
		var task = this.task_list[i];
		task.power = task.getTaskPower();
		Ptasks += task.power;
	}
	return Ptasks;
}
Model.prototype.setup = function(){
	this.mode = 'active';
	this.Ph;
	this.Pstandby;
	this.Ptasks;
	this.Pmcu;
	this.Pl;
	this.Ps;
	this.dt;
	this.hour;
	this.minute;
	this.second;
	this.S = this.sys_params.application.storage.capacity * this.sys_params.application.storage.initial_storage;
	now_time = start_time;
	this.info = [];
}
Model.prototype.calculate = function(){
	var load_efficiency = this.sys_params.application.load.load_power_manager.efficiency;
	var storage_efficiency = this.sys_params.application.storage.charge_efficiency;
	var next_time;
	var i=0;
	var info = [];
	drive_time_task_list = [0,0,0];
	while(this.S > 0 && i < 150000){
		next_time = this.setNextTime(now_time);
		this.Ph = this.getHarvestedPower(now_time);
		this.Pstandby = this.getStandbyPower();
		this.Ptasks = this.getTasksPower();
		this.Pmcu = this.Ptasks + this.Pstandby;
		this.Pl = this.Pmcu / load_efficiency;
		this.Ps = this.Ph - this.Pl;
		

		
		this.dt = next_time - now_time;
		

		this.hour =  Math.floor(now_time/3600);
		this.minute =  Math.floor((now_time-this.hour*3600)/60);
		this.second =  Math.floor(now_time-this.hour*3600-this.minute*60);

		/*var task_mode_list = [];
		for(var j=0;j<drive_time_task_list.length;j++){
			task_mode_list[j] = this.task_list[j].now_mode;
			drive_time_task_list[j] += this.dt * this.task_list[j].now_mode;
		}*/
		var physic_list =[];
		for(var j=0;j<this.physic_list.length;j++){
			physic_list[j]  = this.physic_list[j].now_value;
		}


		info[i] = {'storage':this.S,'Ps':this.Ps,'Ph':this.Ph,'Pl':this.Pl,'Ptasks':this.Ptasks,'Pstandby':this.Pstandby,'now_time':now_time,'dt':this.dt,'time':{'h':this.hour,'m':this.minute,'s':this.second},/*'task_mode_list':task_mode_list,*/'physic_value_list':physic_list,'task_power_list':[this.task_list[0].power,this.task_list[1].power,this.task_list[2].power],'next_time':next_time};
		if(this.Ph-this.Pl >0){
			this.S += storage_efficiency*(this.Ph-this.Pl)*this.dt;
		}else{
			this.S += (this.Ph-this.Pl)*this.dt;
		}
		i++;
		now_time = next_time;
		
	}
	this.finish_time = now_time;
	this.finish_h = Math.ceil((this.finish_time % one_day) / one_hour);
	this.info = info;
	console.log(info);
}
var model = new Model;
model.setup();
model.calculate();
