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
	this.next_time=-1;
	this.parent_model = {};
}

Task.prototype.setNextTimer = function(time){
	console.log('hello',this);
	if(this.trigger.type == 'timer'){
		if(this.now_mode){
			this.now_mode = false;
			if(this.trigger.timer_type == 'periodic'){
				this.next_time = time+this.trigger.cycle;
				return this.next_time;
			}else if(this.trigger.timer_type == 'constant'){
				alert('to be written');//return next_time
			}
		}else{
			this.now_mode = true;
			if(this.trigger.timer_type == 'periodic'){
				this.next_time = time+this.execution_time/1000;
				return this.next_time;
			}else if(this.timer_type == 'constant'){
				alert('to be written');//return next_time
			}
		}

	}else if(this.trigger.type == 'interface'){
		if(this.now_mode){
			if(this.next_time == -1 ){
				console.log('waite');
				return this.next_time = time+this.execution_time/1000;
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
		console.log(this.outputs);
		if(this.outputs){

		}
		if(this.now_mode)
			console.log(this.parent_model);

		return this.now_mode ? this.voltage*this.current/1000:0; 
	}

	
}