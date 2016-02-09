Model.prototype.showGraph = function(){
    google.charts.load('current', {'packages':['line','corechart']});
    //google.charts.load('current', {'packages':['corechart']});


    google.charts.setOnLoadCallback(drawChartStorage);
    google.charts.setOnLoadCallback(drawChartPtask);
    google.charts.setOnLoadCallback(drawChartPhysic);
    //google.charts.setOnLoadCallback(drawChartPh); 
    google.charts.setOnLoadCallback(drawChartPtaskZoomed);
    google.charts.setOnLoadCallback(drawVisualization);    

    var model = this;

    var info = this.info;

    function drawChartStorage() {
        var data_storage = new google.visualization.DataTable();
        data_storage.addColumn('number', 'time');
        data_storage.addColumn('number', 'storage');
        data_storage.addColumn('number', 'Ps');
        data_storage.addColumn('number', 'Pl');
        data_storage.addColumn('number', 'dt/20');

        for(var i=0;i<info.length;i++){
            data_storage.addRows([[info[i].now_time,info[i].storage,info[i].Ps,info[i].Pl,info[i].dt/20]]);
        }

        var options_storage = {
            chart_storage: {
              title: 'Box Office Earnings in First Two Weeks of Opening',
              subtitle: 'in millions of dollars (USD)'
            },
            hAxis: {title: '時刻',
                            viewWindow: {min:start_time,max:this.finish_time}},
            width: 900,
            height: 500,
            lineWidth: 1,
            pointSize: 0.2,
            series: {
            0: {targetAxisIndex:1,type: "line"},
            1: {targetAxisIndex:0,type: "line"},
            2: {targetAxisIndex:0,type: "line"},
            3: {targetAxisIndex:0,type: "line"},
            4: {targetAxisIndex:0,type: "line"}
        }
        };


        var chart_storage = new google.visualization.ScatterChart(document.getElementById('chart_storage'));

        chart_storage.draw(data_storage, options_storage);
    }
    function drawChartPtask() {

        var data_Ptask = new google.visualization.DataTable();
        data_Ptask.addColumn('timeofday', 'time');
        data_Ptask.addColumn('number', 'Pstandby');
        data_Ptask.addColumn('number', 'Ptask1');
        data_Ptask.addColumn('number', 'Ptask2');
        data_Ptask.addColumn('number', 'Ptask3');
        data_Ptask.addColumn('number', 'harvested_power');
        data_Ptask.addColumn('number', 'Storage');

        for(var i=0;i<info.length-1;i++){
            data_Ptask.addRows([[[info[i+1].time.h, info[i+1].time.m, info[i+1].time.s],info[i].Pstandby,info[i].task_power_list[0],info[i].task_power_list[1],info[i].task_power_list[2],info[i+1].Ph,info[i+1].storage]]);
        }

        var options_Ptask = {
            chart_Ptask: {
              title: 'Box Office Earnings in First Two Weeks of Opening',
              subtitle: 'in millions of dollars (USD)'
            },
            hAxis: {title: 'time',
                            viewWindow: {min:[8,0,0]},     // 表示範囲を 450 - 700
                            gridlines:{color:'transparent'}},
            //vAxis: {title: 'power [W]'},
            

            vAxes: {
                0: {
                  title:'power [W]'
                },
                1:{
                    title:'storage [J]'
                }
            },

            explorer: {
                maxZoomIn:0.25,
                keepInBounds: true
            },
            width: 900,
            height: 300,
            //lineWidth: 1,
            //pointSize: 0.2,
            //connectSteps:false,
            isStacked: true,
            series: {
                0: {targetAxisIndex:0,type: "steppedArea"},
                1: {targetAxisIndex:0,type: "steppedArea"},
                2: {targetAxisIndex:0,type: "steppedArea"},
                3: {targetAxisIndex:0,type: "steppedArea"},
                4: {targetAxisIndex:0,type: "line"},
                5: {targetAxisIndex:1,type: "line"}
            }
        };

        var chart_Ptask = new google.visualization.SteppedAreaChart(document.getElementById('chart_Ptask'));

        chart_Ptask.draw(data_Ptask, options_Ptask);
    }
    function drawChartPtaskZoomed() {

        var data_Ptask = new google.visualization.DataTable();
        data_Ptask.addColumn('timeofday', 'time');
        data_Ptask.addColumn('number', 'Pstandby');
        data_Ptask.addColumn('number', 'Ptask1');
        data_Ptask.addColumn('number', 'Ptask2');
        data_Ptask.addColumn('number', 'Ptask3');

        for(var i=0;i<info.length-1;i++){
            data_Ptask.addRows([[[info[i+1].time.h, info[i+1].time.m, info[i+1].time.s],info[i].Pstandby,info[i].task_power_list[0],info[i].task_power_list[1],info[i].task_power_list[2]]]);
        }


        var options_Ptask = {
        chart_Ptask: {
          title: 'Box Office Earnings in First Two Weeks of Opening',
          subtitle: 'in millions of dollars (USD)'
        },
        hAxis: {title: '時刻',
                        viewWindow: p_zoom_range,     // 表示範囲を 450 - 700
                        gridlines:{color:'transparent'}},
        width: 900,
        height: 300,
        //lineWidth: 1,
        //pointSize: 0.2,
        //connectSteps:false,
        isStacked: true
        };

        var chart_Ptask = new google.visualization.SteppedAreaChart(document.getElementById('chart_Ptask_zoomed'));

        chart_Ptask.draw(data_Ptask, options_Ptask);
    }
    function drawChartPhysic() {

        var data_physic = new google.visualization.DataTable();
        data_physic.addColumn('timeofday', 'time');
        for(var i=0;i<info[i].physic_value_list.length;i++){
           data_physic.addColumn('number', model.physic_list[i].name); 
        }
        for(var i=0;i<info.length;i++){
            var array = [[info[i].time.h, info[i].time.m, info[i].time.s]];
            for(var j=0;j<info[i].physic_value_list.length;j++){
                array.push(info[i].physic_value_list[j]);
            }
            data_physic.addRows([array]);
        }

        var options_physic = {
        chart_physic: {
          title: 'Box Office Earnings in First Two Weeks of Opening',
          subtitle: 'in millions of dollars (USD)'
        },
        hAxis: {title: 'time',
                        viewWindow: {min:[8,0,0]},     // 表示範囲を 450 - 700
                        gridlines:{color:'transparent'}},
        width: 900,
        height: 300,
        lineWidth: 1,
        pointSize: 0.2
        };

        var chart_physic = new google.visualization.ScatterChart(document.getElementById('chart_physic'));

        chart_physic.draw(data_physic, options_physic);
    }
    function drawChartPh() {

        var data_harvested = new google.visualization.DataTable();
        data_harvested.addColumn('number', 'time');
        data_harvested.addColumn('number', 'harvested');

        for(var i=0;i<info.length;i++){
            data_harvested.addRows([[info[i].now_time,info[i].Ph]]);
        }

        var options_harvested = {
        chart_harvested: {
          title: 'Box Office Earnings in First Two Weeks of Opening',
          subtitle: 'in millions of dollars (USD)'
        },
        width: 900,
        height: 500
        };

        var chart_harvested = new google.charts.Line(document.getElementById('chart_harvested'));

        chart_harvested.draw(data_harvested, options_harvested);
    }
    function drawChartPowers() {

        var data_Powers = new google.visualization.DataTable();
        data_Powers.addColumn('number', 'time');
        data_Powers.addColumn('number', 'Ps');
        data_Powers.addColumn('number', 'Pload');
        data_Powers.addColumn('number', 'Pharvested');


        for(var i=0;i<info.length;i++){
            data_Powers.addRows([[info[i].now_time,info[i].Ps,info[i].Pl,info[i].Ph]]);
        }

        var options_Powers = {
            chart_Powers: {
              title: 'Box Office Earnings in First Two Weeks of Opening',
              subtitle: 'in millions of dollars (USD)'
            },
           // hAxis: {title: '時刻',
             //               viewWindow: {min:35900,max:36100}},
            width: 900,
            height: 500,
            lineWidth: 1,
            curveType: 'function',
            pointSize: 0.2
        };


        var chart_Powers = new google.visualization.ScatterChart(document.getElementById('chart_Powers'));

        chart_Powers.draw(data_Powers, options_Powers);
    }
    function drawVisualization() {
        // Some raw data (not necessarily accurate)
        var data = google.visualization.arrayToDataTable([
         ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
         ['2004/05',  165,      938,         522,             998,           450,      614.6],
         ['2005/06',  135,      1120,        599,             1268,          288,      682],
         ['2006/07',  157,      1167,        587,             807,           397,      623],
         ['2007/08',  139,      1110,        615,             968,           215,      609.4],
         ['2008/09',  136,      691,         629,             1026,          366,      569.6]
      ]);

    var options = {
      title : 'Monthly Coffee Production by Country',
      vAxis: {title: 'Cups'},
      hAxis: {title: 'Month'},
      seriesType: 'bars',
      series: {
            0: {targetAxisIndex:0,type: "line"},
            1: {targetAxisIndex:0,type: "line"},
            2: {targetAxisIndex:0,type: "line"},
            3: {targetAxisIndex:0,type: "line"},
            4: {targetAxisIndex:1,type: "line"},
            5: {targetAxisIndex:1,type: "line"}
        }
    };
    


    var chart = new google.visualization.ComboChart(document.getElementById('test'));
    chart.draw(data, options);
  }

}
model.showGraph();