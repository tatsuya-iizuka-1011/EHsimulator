if(this.environment){
		this.environment.energy = new Energy;
		console.log(this.environment.energy.cycle);
		this.environment.physical = new Physical;
	}
	if(this.application){
		this.application.harvester = new Harvester;
		this.application.load = new Load;
	}

	function Energy(){
		this.energy_profile = energy_profile_from_input();
		this.cycle = energy_cycle_from_input;
	}
	function energy_profile_from_input(now_time){
		return Math.sin(now_time);
	}

	function Physical(){
		
	}
	function Event(){
		
	}

	function Harvester(){
		this.scale = input_params.application.harvester.scale;
		this.efficiency = input_params.application.harvester.efficiency;
	}

	function Storage(){
		this.capacity = 450;//[mAh]
		this.efficiency = 0.99;
		this.leak_current = 1.0 * Math.pow(10,-7);
	}

	function Load(){
		this.load_power_manager = new LoadPowerManger;
		this.mcu = new MCU;
		this.tasks = new Tasks;
	}
	function LoadPowerManger(){
		this.efficiency = 0.9;
	}
	function MCU(){
		this.mode_list = new Array;
		this.mode_list.push({'mode':'active','current':50});
		this.mode_list.push({'mode':'sleep','current':10});
		this.mode_list.push({'mode':'WiFi_standby','current':80});
		this.mode_list.push({'mode':'WiFi_TX','current':120});
	}
	function Tasks(task_list_from_input){
		this.task_list = new Array(); 
		for(i=0;i++;i<task_list_from_input.length){
			this.task_list.push({
				'type':'sensing',
				'current':35,//[mA]
				'execution_time':100,//[ms]
				'trigger':{'type':'timer'}

			})
		}
	}