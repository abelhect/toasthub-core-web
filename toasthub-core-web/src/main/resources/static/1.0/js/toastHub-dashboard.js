/**
 * @author Edward H. Seufert
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function ToastHubDashboard() {

	//params = {container:x,cards:[{icon:"<i class='fa fa-caret-square-o-right'></i>",title:"Total Users",desc:"From last week",count:"2000"},
	//			{icon:"<i class='fa fa-clock-o'></i>",title:"Average Time",desc:"From last week",count:"3000"}]};
				
	this.listCards = function(params) {
		var cardRow = document.createElement("DIV");
		cardRow.className = "row top_tiles";
		params.container.appendChild(cardRow);
		
		var items = params.cards;
		for(var i = 0; i < items.length; i++) {
			this.cardRenderer({container:cardRow,card:items[i]});
		}
	};
	
	this.cardRenderer = function(params) {
		var cardWrapper = document.createElement("DIV");
		cardWrapper.className = "animated flipInY col-lg-3 col-md-3 col-sm-6 col-xs-12";
		params.container.appendChild(cardWrapper);
		
		var tile = document.createElement("DIV");
		tile.className = "tile-stats";
		cardWrapper.appendChild(tile);
		
		var icon = document.createElement("DIV");
		icon.className = "icon";
		icon.innerHTML = params.card.icon;
		tile.appendChild(icon);
		
		var count = document.createElement("DIV");
		count.className = "count";
		count.innerHTML = params.card.count;
		tile.appendChild(count);
		
		if (params.card.title != null) {
			var title = document.createElement("H3");
			title.innerHTML = params.card.title;
			tile.appendChild(title);
		}
		
		if (params.card.desc != null) {
			var desc = document.createElement("P");
			desc.innerHTML = params.card.desc;
			tile.appendChild(desc);
		}
	};
	
	//params = {container:x,stats:[{icon:"<i class='fa fa-user'></i>",title:"Total Users",percent:"<i class='green'>3% </i>",percentTitle:"From last week",count:"2000"},
	//			{icon:"<i class='fa fa-clock-o'></i>",title:"Average Time",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"3000"}]};
				
	this.listStats = function(params) {
		var statRow = document.createElement("DIV");
		statRow.className = "row tile_count";
		params.container.appendChild(statRow);
		
		var items = params.stats;
		for(var i = 0; i < items.length; i++) {
			this.statRenderer({container:statRow,stat:items[i]});
		}
	};
	
	this.statRenderer = function(params) {
		var statWrapper = document.createElement("DIV");
		statWrapper.className = "col-md-2 col-sm-4 col-xs-6 tile_stats_count";
		params.container.appendChild(statWrapper);
	
		var icon = document.createElement("SPAN");
		icon.className = "count_top";
		icon.innerHTML = params.stat.icon + " " + params.stat.title;
		statWrapper.appendChild(icon);
		
		var count = document.createElement("DIV");
		count.className = "count";
		count.innerHTML = params.stat.count;
		statWrapper.appendChild(count);
		
		if (params.stat.percent != null) {
			var percent = document.createElement("SPAN");
			percent.className = "count_bottom";
			percent.innerHTML = params.stat.percent + " " + params.stat.percentTitle;
			statWrapper.appendChild(percent);
		}
	};
	
	this.clearfix = function(params){
		var clear = document.createElement("DIV");
		clear.className = "clearfix";
		params.container.appendChild(clear);
	};
	
	
}; // Dashboard

///////////////////////////////////////////////////////////////////////////////////////////////////////

function ToastHubDashBoard2() {
	
	this.render = function(params){
		
		this.renderTitle(params);
		
		var content = document.createElement("DIV");
		content.className = "x_content";
		params.container.appendChild(content);
		params.container = content;
		
		this.renderGraph(params);
		
		this.renderTopItems(params);
		
		this.activateDatePicker();
		this.buildMainGraph(params);
		this.buildLineGraphs(params);
		
	};
	
	this.renderTitle = function(params) {
		var title = document.createElement("DIV");
		title.className = "x_title";
		params.container.appendChild(title);
		
		if (params.title != null) {
			var h2 = document.createElement("H2");
			h2.innerHTML = params.title;
			title.appendChild(h2);
		}
		
		var filter = document.createElement("DIV");
		filter.className = "filter";
		title.appendChild(filter);
		
		var reportRange = document.createElement("DIV");
		reportRange.id = "reportrange";
		reportRange.className = "pull-right";
		reportRange.style = "background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc";
		reportRange.innerHTML = '<i class="glyphicon glyphicon-calendar fa fa-calendar"></i><span>December 30, 2016 - January 28, 2017</span> <b class="caret"></b>';
		filter.appendChild(reportRange);
		
		toastHub.utils.clearFix(title);
	}; // renderTitle
	
	this.renderGraph = function(params) {
		var col = document.createElement("DIV");
		col.className = "col-md-9 col-sm-12 col-xs-12";
		params.container.appendChild(col);
		
		// main Graph
		var mainGraphContainer = document.createElement("DIV");
		mainGraphContainer.className = "demo-container";
		mainGraphContainer.style = "height:280px";
		col.appendChild(mainGraphContainer);
		
		var mainGraph = document.createElement("DIV");
		mainGraph.id = "placeholder33x";
		mainGraph.className = "demo-placeholder";
		mainGraphContainer.appendChild(mainGraph);
		
		var tileWrap = document.createElement("DIV");
		tileWrap.className = "tiles";
		col.appendChild(tileWrap);
		
		// tiles
		var items = params.tiles;
		for(var i = 0; i < items.length; i++) {
			var tileCol = document.createElement("DIV");
			tileCol.className = "col-md-4 tile";
			tileWrap.appendChild(tileCol);
			
			var title = document.createElement("SPAN");
			title.innerHTML = items[i].title;
			tileCol.appendChild(title);
			
			var count = document.createElement("H2");
			count.innerHTML = items[i].count;
			tileCol.appendChild(count);
			
			var graph = document.createElement("SPAN");
			graph.id = items[i].id;
			graph.className = "graph";
			graph.style = "line-height: 160px;"
			graph.innerHTML = '<canvas width="200" height="60" style="display: inline-block; vertical-align: top; width: 190px; height: 100px;"></canvas>';
			tileCol.appendChild(graph);
			
		}
		
	}; // renderGraph
	
	this.buildMainGraph = function(params) {
		//define chart clolors ( you maybe add more colors if you want or flot will add it automatic )
        var chartColours = ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'];

        //generate random number for charts
        var randNum = function() {
          return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
        };

        var d1 = [];
        //var d2 = [];

        //here we generate data for chart
        for (var i = 0; i < 30; i++) {
          d1.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
          //    d2.push([new Date(Date.today().add(i).days()).getTime(), randNum()]);
        }

        var chartMinDate = d1[0][0]; //first day
        var chartMaxDate = d1[20][0]; //last day

        var tickSize = [1, "day"];
        var tformat = "%d/%m/%y";

        //graph options
        var options = {
          grid: {
            show: true,
            aboveData: true,
            color: "#3f3f3f",
            labelMargin: 10,
            axisMargin: 0,
            borderWidth: 0,
            borderColor: null,
            minBorderMargin: 5,
            clickable: true,
            hoverable: true,
            autoHighlight: true,
            mouseActiveRadius: 100
          },
          series: {
            lines: {
              show: true,
              fill: true,
              lineWidth: 2,
              steps: false
            },
            points: {
              show: true,
              radius: 4.5,
              symbol: "circle",
              lineWidth: 3.0
            }
          },
          legend: {
            position: "ne",
            margin: [0, -25],
            noColumns: 0,
            labelBoxBorderColor: null,
            labelFormatter: function(label, series) {
              // just add some space to labes
              return label + '&nbsp;&nbsp;';
            },
            width: 40,
            height: 1
          },
          colors: chartColours,
          shadowSize: 0,
          tooltip: true, //activate tooltip
          tooltipOpts: {
            content: "%s: %y.0",
            xDateFormat: "%d/%m",
            shifts: {
              x: -30,
              y: -50
            },
            defaultTheme: false
          },
          yaxis: {
            min: 0
          },
          xaxis: {
            mode: "time",
            minTickSize: tickSize,
            timeformat: tformat,
            min: chartMinDate,
            max: chartMaxDate
          }
        };
        var plot = jQuery.plot(jQuery("#placeholder33x"), [{
          label: params.chartKey,
          data: d1,
          lines: {
            fillColor: "rgba(150, 202, 89, 0.12)"
          }, //#96CA59 rgba(150, 202, 89, 0.42)
          points: {
            fillColor: "#fff"
          }
        }], options);
	}; // buildMainGraph
	
	this.buildLineGraphs = function(params) {
		var items = params.tiles;
		for(var i = 0; i < items.length; i++) {
			jQuery("#".concat(items[i].id)).sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5], {
		          type: 'bar',
		          height: '80',
		          width: '96%',
		          barWidth: 7,
		          colorMap: {
		            '7': '#a1a1a1'
		          },
		          barSpacing: 2,
		          barColor: '#26B99A'
		        });
		}
	}; // buildLineGraphs
	
	this.renderTopItems = function(params) {
		var col = document.createElement("DIV");
		col.className = "col-md-3 col-sm-12 col-xs-12";
		params.container.appendChild(col);
		
		var wrap = document.createElement("DIV");
		col.appendChild(wrap);
		
		var title = document.createElement("DIV");
		title.className = "x_title";
		wrap.appendChild(title);
		
		var h2 = document.createElement("H2");
		h2.innerHTML = "Top performers";
		title.appendChild(h2);
		
		toastHub.utils.clearFix(title);
		
		var ul = document.createElement("UL");
		ul.className = "list-unstyled top_profiles scroll-view";
		wrap.appendChild(ul);
		
		// tiles
		var items = params.topItems;
		for(var i = 0; i < items.length; i++) {
			var li = document.createElement("LI");
			li.className = "media event";
			ul.appendChild(li);
			
			var href = document.createElement("A");
			href.className = "pull-left border-aero profile_thumb";
			href.innerHTML = '<i class="fa fa-user aero"></i>';
			li.appendChild(href);
			
			var body = document.createElement("DIV");
			body.className = "media-body";
			li.appendChild(body);
			
			var hrefBody = document.createElement("A");
			hrefBody.className = "title";
			hrefBody.href = "#";
			hrefBody.innerHTML = items[i].name;
			body.appendChild(hrefBody);
			
			var msg1 = document.createElement("P");
			msg1.innerHTML = items[i].msg1;
			body.appendChild(msg1);
			
			var msg2 = document.createElement("P");
			msg2.innerHTML = items[i].msg2;
			body.appendChild(msg2);
		}
	}; // renderTopItems
	
	
	this.activateDatePicker = function(){
		var cb = function(start, end, label) {
	          console.log(start.toISOString(), end.toISOString(), label);
	          jQuery('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	        };

	        var optionSet1 = {
	          startDate: moment().subtract(29, 'days'),
	          endDate: moment(),
	          minDate: '01/01/2012',
	          maxDate: '12/31/2015',
	          dateLimit: {
	            days: 60
	          },
	          showDropdowns: true,
	          showWeekNumbers: true,
	          timePicker: false,
	          timePickerIncrement: 1,
	          timePicker12Hour: true,
	          ranges: {
	            'Today': [moment(), moment()],
	            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	            'This Month': [moment().startOf('month'), moment().endOf('month')],
	            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	          },
	          opens: 'left',
	          buttonClasses: ['btn btn-default'],
	          applyClass: 'btn-small btn-primary',
	          cancelClass: 'btn-small',
	          format: 'MM/DD/YYYY',
	          separator: ' to ',
	          locale: {
	            applyLabel: 'Submit',
	            cancelLabel: 'Clear',
	            fromLabel: 'From',
	            toLabel: 'To',
	            customRangeLabel: 'Custom',
	            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	            firstDay: 1
	          }
	        };
	        jQuery('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
	        jQuery('#reportrange').daterangepicker(optionSet1, cb);
	        jQuery('#reportrange').on('show.daterangepicker', function() {
	          console.log("show event fired");
	        });
	        jQuery('#reportrange').on('hide.daterangepicker', function() {
	          console.log("hide event fired");
	        });
	        jQuery('#reportrange').on('apply.daterangepicker', function(ev, picker) {
	          console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
	        });
	        jQuery('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
	          console.log("cancel event fired");
	        });
	        jQuery('#options1').click(function() {
	          jQuery('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
	        });
	        jQuery('#options2').click(function() {
	          jQuery('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
	        });
	        jQuery('#destroy').click(function() {
	          jQuery('#reportrange').data('daterangepicker').remove();
	        });
	}; // activateDatePicker
}; // Dashboard2

