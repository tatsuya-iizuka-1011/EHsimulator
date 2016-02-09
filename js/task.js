function Task(){
	this.name;
	this.type;
	this.current;
	this.voltage;
	this.execution_time;
	this.trigger = {};
	this.outputs;
	this.now_mode=false;
	this.power;
	this.next_time=start_time;
	this.parent_model = {};
}
Task.prototype.setNextTimer = function(time){
	if(this.trigger.type == 'timer'){
		if(this.now_mode){
			if(this.next_time == time){
				this.now_mode = false;
				if(this.trigger.timer_type == 'periodic'){
					this.next_time = time+this.trigger.cycle;
					return this.next_time;
				}else if(this.trigger.timer_type == 'constant'){
					alert('to be written');//return next_time
				}
			}
		}else{
			if(this.next_time == time){
				this.now_mode = true;
				if(this.trigger.timer_type == 'periodic'){
					this.next_time = time+this.execution_time/1000;
					return this.next_time;
				}else if(this.timer_type == 'constant'){
					alert('to be written');//return next_time
				}
			}
		}

	}else if(this.trigger.type == 'interface'){
		if(this.now_mode){
			if(this.next_time == -1 ){
				this.next_time = time+this.execution_time/1000;
				//sensor should stop when trigger task is driving
				if(this.driven_interface.driven_task||this.driven_interface.driven_task.trigger.type == 'timer'){
					var driven_task = this.driven_interface.driven_task;
					driven_task.now_mode = false;
					driven_task.next_time = this.next_time + driven_task.trigger.cycle;
				}
				return this.next_time;
			}else if(this.next_time == time){
				this.now_mode = false;
				return this.next_time = -1;
			}
		}else{
			return this.next_time = -1;
		}
	}else if(this.trigger.type == 'follow_other_task'){
		if(this.now_mode){
			if(this.next_time == -1 ){
				this.next_time = time+this.execution_time/1000;
				var task = this;
				while(task.driven_task){
					task = task.driven_task;
					if(task.trigger.type == 'timer'){
						task.now_mode = false;
						task.next_time = this.next_time + task.trigger.cycle;
						break;

					}
				}
				return this.next_time = time+this.execution_time/1000;
			}else if(this.next_time == time){
				this.now_mode = false;
				return this.next_time = -1;
			}
		}else{
			return this.next_time = -1;
		}
	}
}
Task.prototype.getTaskPower = function(){
	if(this.type == 'data_transmission'){
		var mode_list = this.parent_model.sys_params.application.load.mode_list;
		for(var i = 0;i<mode_list.length;i++){
			if(this.mode == mode_list[i].mode){
				var mode = mode_list[i];
				return this.now_mode ? mode.voltage * mode.current /1000:0; //[W]
			}
		}
	}else if(this.type == 'sensor'){
		return this.now_mode ? this.voltage*this.current/1000:0; 
	}else if(this.type == 'actuator'){
		if(this.outputs){
			return this.now_mode ? this.voltage*this.current/1000:0; 
		}
		if(this.now_mode)
			//console.log(this.parent_model);

		return this.now_mode ? this.voltage*this.current/1000:0; 
	}	
}