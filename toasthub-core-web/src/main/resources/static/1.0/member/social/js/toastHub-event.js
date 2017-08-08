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

toastHubEvent.prototype = Object.create(toastHubBase.prototype); 
toastHubEvent.prototype.constructor = toastHubEvent;

function toastHubEvent(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "member";
	this.service = "EVENT_SVC";
	this.mainContainer = null;
	this.panel = new ToastHubPanel();
	
	var self = parent;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-event::toastHubEvent::initCustom",params);
		params.action = "INIT";
		params.appTexts = ["GLOBAL_PAGE"];

	}; // initCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-event::toastHubEvent::initContent",params);
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
	
		// create dashboard of user metrics
		var dashboard = new ToastHubDashboard();
		var totalCount = params.itemCount ? null : 0;
		var params2 = {container:self.mainContainer,stats:[{icon:"<i class='fa fa-tag'></i>",title:"#Crazy",count:"2000",percent:"<i class='green'><i class='fa fa-sort-asc'></i>50% </i>",percentTitle:"From yesterday"},
		                                {icon:"<i class='fa fa-tag'></i>",title:"#Funny",count:"45",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From yesterday"},
		                                {icon:"<i class='fa fa-tag'></i>",title:"#Blackhat",count:"200",percent:"<i class='green'><i class='fa fa-sort-asc'></i>15% </i>",percentTitle:"From last week"},
		                                {icon:"<i class='fa fa-tag'></i>",title:"#Tripping",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From last week",count:"30"},
		           						{icon:"<i class='fa fa-tag'></i>",title:"#BigMoney",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"3000"},
		           						{icon:"<i class='fa fa-tag'></i>",title:"#Sleepless",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"52"}]};
		dashboard.listStats(params2);
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,contentId:"content-area",header:true});
		
		this.drawContent(params);
	}; // initContent
	
	
	this.drawContent = function(params){
		
		var test = document.createElement("H2");
		test.innerHTML = "Welcome to Events";
		self.contentArea.appendChild(test);
		
		
	}; // drawContent
	
	
} // toastHubEvent